import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { handleError, sendError, sendSuccess } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') return sendError('Only POST method is allowed', 405);
  const result = await req.json();
  const { nickname } = result;

  if (!nickname) return sendError('No nickname provided', 400);

  try {
    const token = await getToken({ req });
    if (!token || !token.email) return sendError('Unauthorized', 401);

    await client.user.update({
      where: {
        email: token.email,
      },
      data: {
        nickname,
      },
    });

    return sendSuccess('Nickname updated');
  } catch (error) {
    return handleError(error);
  }
}

export const config = {
  runtime: 'experimental-edge',
};
