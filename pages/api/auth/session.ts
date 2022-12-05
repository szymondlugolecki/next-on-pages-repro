import type { NextRequest } from 'next/server';
import { handleError, privateUserParser, sendError, sendSuccess } from '../../../lib/edgeFunctions';
import verifyToken from '../../../lib/server/verifyToken';
import client from '../../../lib/prismaClient';
import type { Session, User } from '../../../types';
import { JWTPayload } from 'jose';
import { aTCookie } from '../../../lib/server/constants';

// import { Session } from '../../../types';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return sendError({ message: 'Only GET method is allowed', code: 405 });

  // Check if Authorization header is included
  // const refreshToken = req.headers.get('Authorization');
  const accessTokenCookie = req.cookies.get(aTCookie) || null;
  if (!accessTokenCookie) return sendError({ message: 'Unauthorized', code: 401 });

  const accessTokenCookieSplit = accessTokenCookie.split(' ');

  // Check if its correct
  const accessToken = accessTokenCookieSplit[1];
  if (!accessToken) return sendError({ message: 'Invalid token', code: 403 });

  try {
    // Verify the token, respond with the subject
    const { payload } = await verifyToken(accessToken);
    const { exp } = payload;
    console.log('Session', 'Expires in', (exp || 0) - Date.now() / 1000, 'seconds');

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
    console.error(error);
    if (error.code === 'ERR_JWT_EXPIRED') {
      return sendError({ message: 'Authorization token expired', code: 403 });
    }
    if (error.code.startsWith('ERR_JWT')) {
      return sendError({ message: 'Invalid authorization token', code: 403 });
    }
    return handleError(error, {
      message: 'Unexpected error. Try again later...',
      code: 500,
    });
  }
}
