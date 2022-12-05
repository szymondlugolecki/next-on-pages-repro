import type { NextRequest } from 'next/server';
import { extractBrowserInfo, handleError, sendError } from '../../../lib/edgeFunctions';
import {
  createRefreshToken,
  createAccessToken,
  createATCookie,
} from '../../.../../../lib/server/createToken';
import verifyToken from '../../../lib/server/verifyToken';
import type { SuccessResponse } from '../../../types';
import client from '../../../lib/prismaClient';
import type { JWTPayload } from 'jose';
// import { Session } from '../../../types';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  console.log('api/auth/refresh');

  const rTHeader = req.headers.get('authorization');
  if (!rTHeader) return sendError({ message: 'Unauthorized', code: 401 });

  const rtHeaderSplit = rTHeader.split(' ');
  const refreshToken = rtHeaderSplit[1];

  if (!refreshToken) return sendError({ message: 'Invalid token', code: 403 });

  try {
    // Verify the token, respond with the subject
    const { payload } = await verifyToken(refreshToken);
    const { exp } = payload;
    console.log('Refresh', 'Expires in', (exp || 0) - Date.now() / 1000, 'seconds');

    const { userId } = payload as JWTPayload & { user: string };
    if (!userId) return sendError({ message: 'Token error', code: 500 });

    const user = await client.user.findFirst({ where: { id: userId as string } });

    if (!user) return sendError({ message: 'No user with this id was found', code: 400 });

    const browserInfo = extractBrowserInfo(req.headers.get('User-Agent'));
    const newRefreshToken = await createRefreshToken({ browserInfo, userId: userId as string });
    const newAccessToken = await createAccessToken({ browserInfo, user });

    const accessTokenCookie = createATCookie(newAccessToken);

    return new Response(
      JSON.stringify({
        message: 'Success',
        data: { refreshToken: newRefreshToken },
        success: true,
      } as SuccessResponse),
      {
        headers: {
          'Set-Cookie': accessTokenCookie,
          'content-type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      return sendError({ message: 'Authorization token expired', code: 401 });
    }
    return handleError(error, {
      message: 'Unexpected error. Try again later...',
      code: 500,
    });
  }
}
