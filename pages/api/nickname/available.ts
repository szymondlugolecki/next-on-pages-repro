import type { NextRequest } from 'next/server';
import { handleError, sendError, sendSuccess } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return sendError('Only GET method is allowed', 405);

  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');
  if (!nickname) return sendError('No nickname provided', 400);

  try {
    // 0 - available
    // >=1 - unavailable
    const count = await client.user.count({
      where: {
        nickname,
      },
    });

    return sendSuccess(undefined, { available: !Boolean(count) });
  } catch (error) {
    return handleError(error);
  }
}
