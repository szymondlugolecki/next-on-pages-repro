// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { handleError, sendError } from '../../../../lib/edgeFunctions';
import client from '../../../../lib/prismaClient';
import createRefreshToken from '../../../../lib/server/createRefreshToken';

export const config = {
  runtime: 'experimental-edge',
};

const threeWeeks = 1000 * 60 * 60 * 24 * 21;

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return sendError({ message: 'Only GET method is allowed', code: 405 });

  const { searchParams } = new URL(req.url);

  console.log(req.nextUrl);
  console.log(req.nextUrl.username);
  console.log(req.nextUrl.basePath, req.nextUrl.pathname);
  console.log(req.nextUrl.searchParams, searchParams);

  const verificationID = searchParams.get('token') || '';

  if (!verificationID) return sendError({ message: 'Invalid verification token', code: 400 });

  try {
    const browserInfo =
      `${req.headers.get('user-agent') || req.ip} ${req.headers.get('accept-language')}`
        .replace(/null/g, '')
        .trim() || '';

    console.log('browserInfo', browserInfo);
    console.log('user-agent', req.headers.get('user-agent'), 'ip', req.ip);

    // Check if someone has the verification token assigned
    const user = await client.user.update({
      where: { verifyID: verificationID },
      data: { verifyID: null },
    });

    console.log('user', user);
    if (!user) return sendError({ message: 'Invalid verification token', code: 400 });

    const refreshToken = await createRefreshToken({ browserInfo, userId: user.id });

    await client.userTokens.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + threeWeeks),
        browserInfo,
      },
    });

    console.log('ENVIRONMENT', process.env.NODE_ENV);

    const refreshTokenCookie = `refresh-token=${refreshToken}; Max-Age=${threeWeeks}; HttpOnly; SameSite=Lax; Secure; Path=/`;
    const response = new Response(null, {
      status: 200,
      headers: {
        Location: '/verify',
        'Set-Cookie': refreshTokenCookie,
      },
    });

    console.log('refreshTokenCookie', refreshTokenCookie);

    response.headers.append('Set-Cookie', refreshToken);
    return response;
  } catch (error) {
    return handleError(error, {
      message: 'Unexpected error. Make sure the email is correct',
      code: 400,
    });
  }
}
