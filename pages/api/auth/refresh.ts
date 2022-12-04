import type { NextRequest } from 'next/server';
import { extractBrowserInfo, handleError, sendError } from '../../../lib/edgeFunctions';
import { createRefreshToken, createAccessToken } from '../../.../../../lib/server/createToken';
import verifyToken from '../../../lib/server/verifyToken';
import type { SuccessResponse } from '../../../types';
import client from '../../../lib/prismaClient';
import type { JWTPayload } from 'jose';
// import { Session } from '../../../types';

export const config = {
  runtime: 'experimental-edge',
};

const threeWeeks = 1000 * 60 * 60 * 24 * 21;

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  console.log('api/auth/refresh');

  const refreshToken = req.cookies.get('refresh-token');
  if (!refreshToken) return sendError({ message: 'Unauthorized', code: 401 });

  try {
    // Verify the token, respond with the subject
    const { payload } = await verifyToken(refreshToken);
    const { exp } = payload;
    const expiresIn = (exp || 0) - Date.now() / 1000;
    console.log('Refresh', 'Expires in', expiresIn, 'seconds');

    const { userId } = payload as JWTPayload & { user: string };

    const user = await client.user.findFirst({ where: { id: userId as string } });

    if (!user) return sendError({ message: 'No user with this id was found', code: 400 });

    const browserInfo = extractBrowserInfo(req.headers.get('User-Agent'));
    const newRefreshToken = await createRefreshToken({ browserInfo, userId: userId as string });

    const refreshTokenCookie = `refresh-token=${newRefreshToken}; Max-Age=${threeWeeks}; HttpOnly;${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    } SameSite=Lax; Path=/`;

    const newAccessToken = await createAccessToken({ browserInfo, user });

    return new Response(
      JSON.stringify({
        message: 'Success',
        data: { accessToken: newAccessToken },
        success: true,
      } as SuccessResponse),
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
          'content-type': 'application/json',
        },
        status: 200,
      },
    );

    // Will this throw error if the token is expired?
    // https://gist.github.com/ricardo-dlc/51fb6569bfe3a889cc32bcec9298bdee
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
