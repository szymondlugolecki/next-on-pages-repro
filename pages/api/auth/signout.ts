// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { handleError, sendError } from '../../../lib/edgeFunctions';
import { SuccessResponse } from '../../../types';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return sendError({ message: 'Only GET method is allowed', code: 405 });

  try {
    // res.cookies.delete('refresh-token', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'development' ? false : true,
    //   sameSite: 'lax',
    //   path: '/',
    // });

    return new Response(
      JSON.stringify({ message: 'Successfully removed session', code: 200 } as SuccessResponse),
      {
        headers: {
          'Set-Cookie': `refresh-token=; HttpOnly;${
            process.env.NODE_ENV === 'production' ? 'Secure;' : ''
          } SameSite=Lax; Path=/; Max-Age=1000;`,
        },
      },
    );

    // return Response.redirect(`${process.env.NEXTAUTH_URL}/auth/verify`, 302);
  } catch (error) {
    console.error(error);
    return handleError(error, {
      message: 'Unexpected error. Make sure the email is correct',
      code: 400,
    });
  }
}
