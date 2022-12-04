import type { NextRequest } from 'next/server';
import { handleError, privateUserParser, sendError, sendSuccess } from '../../../lib/edgeFunctions';
import verifyToken from '../../../lib/server/verifyToken';
import client from '../../../lib/prismaClient';
import type { Session, User } from '../../../types';
import { JWTPayload } from 'jose';

// import { Session } from '../../../types';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return sendError({ message: 'Only GET method is allowed', code: 405 });

  // Check if Authorization header is included
  const accessToken = req.headers.get('Authorization');
  const refreshToken = req.cookies.get('refresh-token') || null;
  if (!accessToken && refreshToken) return sendError({ message: 'Forbidden', code: 403 });
  else if (!accessToken) return sendError({ message: 'Unauthorized', code: 401 });
  const tokenSplit = accessToken.split(' ');

  // Check if its correct
  const justToken = tokenSplit[1];
  if (!justToken || justToken.length < 50)
    return sendError({ message: 'Invalid token', code: 403 });

  try {
    // Verify the token, respond with the subject
    const { payload } = await verifyToken(justToken);
    const { exp } = payload;
    const expiresIn = (exp || 0) - Date.now() / 1000;
    console.log('Session', 'Expires in', expiresIn, 'seconds');

    const { user } = payload as JWTPayload & { user: User };

    const sessionUser = await client.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!sessionUser) return sendError({ message: 'User not found', code: 400 });
    if (!exp) return sendError({ message: 'Session expiration time is null', code: 500 });

    const privateUser = privateUserParser(sessionUser);

    return sendSuccess<Session>({
      message: 'Authorized',
      data: { user: privateUser, expires: exp },
    });
  } catch (error: any) {
    console.log(Object.keys(error));
    console.error(error);
    if (error.code === 'ERR_JWT_EXPIRED') {
      return sendError({ message: 'Authorization token expired', code: 403 });
    }
    return handleError(error, {
      message: 'Unexpected error. Try again later...',
      code: 500,
    });
  }
}
