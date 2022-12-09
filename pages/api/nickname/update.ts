// import { getToken } from 'next-auth/jwt';
import { JWTPayload } from 'jose';
import type { NextRequest } from 'next/server';
import { handleError, sendError, sendSuccess } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';
import { aTCookie } from '../../../lib/server/constants';
import verifyToken from '../../../lib/server/verifyToken';
import { User } from '../../../types';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  const accessToken = req.cookies.get(aTCookie) || null;
  if (!accessToken) return sendError({ message: 'Unauthorized', code: 401 });

  const result: { nickname: string } = await req.json();
  const { nickname } = result;

  if (!nickname) return sendError({ message: 'No nickname provided', code: 400 });

  try {
    // Get user
    // Check how many nameChanges they have or whether they have VIP
    const { payload } = await verifyToken(accessToken);
    const { user } = payload as JWTPayload & { user: User };

    const { nameChanges, vip } = await client.user.findFirstOrThrow({
      where: {
        email: user.email,
      },
      select: {
        nameChanges: true,
        vip: true,
      },
    });

    if (nameChanges === 0 && !vip)
      return sendError({ message: 'Not allowed to change name', code: 400 });
    // Has either VIP or at least one nameChange

    // If has vip, don't reduce nameChanges
    await client.user.update({
      where: {
        email: user.email,
      },
      data: {
        nickname,
        nameChanges: vip ? nameChanges : nameChanges - 1,
      },
    });

    return sendSuccess({ message: 'Nickname updated' });
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      return sendError({ message: 'Authorization token expired', code: 401 });
    }
    if (error.code.startsWith('ERR_JWT')) {
      return sendError({ message: 'Invalid refresh token', code: 401 });
    }
    return handleError(error, {
      message: 'Request failed. Make sure your session is up-to date',
      code: 400,
    });
  }
}

export const config = {
  runtime: 'experimental-edge',
};
