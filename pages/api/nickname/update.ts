import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { handleError, sendError, sendSuccess } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });
  const result: { nickname: string } = await req.json();
  const { nickname } = result;

  if (!nickname) return sendError({ message: 'No nickname provided', code: 400 });

  try {
    const token = await getToken({ req });
    if (!token || !token.email) return sendError({ message: 'Unauthorized', code: 401 });

    // Get user
    // Check how many nameChanges they have or whether they have VIP

    const { nameChanges, vip } = await client.user.findFirstOrThrow({
      where: {
        email: token.email,
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
        email: token.email,
      },
      data: {
        nickname,
        nameChanges: vip ? nameChanges : nameChanges - 1,
      },
    });

    return sendSuccess({ message: 'Nickname updated' });
  } catch (error) {
    return handleError(error, {
      message: 'Request failed. Make sure your session is up-to date',
      code: 400,
    });
  }
}

export const config = {
  runtime: 'experimental-edge',
};
