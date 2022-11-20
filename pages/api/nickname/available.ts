import type { NextRequest } from 'next/server';
import { handleFaunaError, sendResponse } from '../../../lib/edgeFunctions';
import faunaClient, { q } from '../../../lib/prismaClient';

export const config = {
  runtime: 'experimental-edge',
};

const isNicknameAvailable = (nickname: string) =>
  faunaClient.query(q.Not(q.Exists(q.Match(q.Index('user_by_nickname'), nickname))));

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') return sendResponse({ message: 'Only GET method is allowed' }, 405);

  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');
  if (!nickname) return sendResponse({ message: 'No nickname provided' }, 400);

  try {
    const available = await isNicknameAvailable(nickname);

    return sendResponse({ available }, 200);
  } catch (error) {
    handleFaunaError(error);
    return sendResponse({ message: 'Unexpected error. Try again later' }, 500);
  }
}
