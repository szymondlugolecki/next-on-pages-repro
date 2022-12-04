// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { extractBrowserInfo, handleError, sendError } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';
import { createRefreshToken, createAccessToken } from '../../../lib/server/createToken';
import { SuccessResponse } from '../../../types/API';

export const config = {
  runtime: 'experimental-edge',
};

const threeWeeks = 1000 * 60 * 60 * 24 * 21;

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  const data: { token: string } = await req.json();
  const { token } = data;

  if (!token) return sendError({ message: 'Invalid verification token', code: 400 });

  try {
    const browserInfo = extractBrowserInfo(req.headers.get('User-Agent'));

    console.log('Checking token', token);
    // Check if someone has the verification token assigned
    const userByVerifyID = await client.user.findUnique({ where: { verifyID: token } });

    // const allUsers = await client.user.findMany({});
    // console.log('allUsers', allUsers);

    // If not, return an error message
    if (!userByVerifyID) {
      console.log('User with this verification DOES NOT token exist! ☹️');
      return sendError({ message: 'Invalid verification token', code: 400 });
    }

    console.log('User with this verification token exists! 🙂');

    const user = await client.user.update({
      where: { verifyID: token },
      data: { verifyID: null },
    });

    const refreshToken = await createRefreshToken({ browserInfo, userId: user.id });

    const userTokensData = {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + threeWeeks),
      browserInfo,
    };

    await client.userTokens.create({
      data: userTokensData,
    });

    const refreshTokenCookie: string = `refresh-token=${refreshToken}; Max-Age=${threeWeeks}; HttpOnly;${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    } SameSite=Lax; Path=/`;

    const accessToken = await createAccessToken({ browserInfo, user });

    return new Response(
      JSON.stringify({
        message: 'User verified',
        data: { accessToken },
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
  } catch (error) {
    return handleError(error, {
      message: 'Unexpected error. Try again later...',
      code: 500,
    });
  }
}
