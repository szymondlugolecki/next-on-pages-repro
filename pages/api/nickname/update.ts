import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { handleFaunaError, sendResponse } from '../../../lib/edgeFunctions';
import faunaClient, { q } from '../../../lib/prismaClient';

const updateUserNickname = (email: string, nickname: string) =>
  faunaClient.query(
    q.Let(
      {
        nicknameTaken: q.Exists(q.Match(q.Index('user_by_nickname'), nickname)),
      },
      q.If(
        q.Not(q.Var('nicknameTaken')),
        q.Update(q.Select(['ref'], q.Get(q.Match(q.Index('user_by_email'), email))), {
          data: {
            nickname,
          },
        }),
        q.Abort('This nickname is already taken'),
      ),
    ),
  );

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') return sendResponse({ message: 'Only POST method is allowed' }, 405);
  const result = await req.json();
  const { nickname } = result;

  if (!nickname) return sendResponse({ message: 'No nickname provided' }, 400);

  try {
    const token = await getToken({ req });
    if (!token || !token.email) return sendResponse({ message: 'Unauthorized' }, 401);

    // const token = { email: 'szymon.dlugolecki77@gmail.com' };

    await updateUserNickname(token.email, nickname);

    return sendResponse({ success: true }, 200);
  } catch (error) {
    handleFaunaError(error);

    return sendResponse({ message: 'Unexpected error. The nickname might be taken' }, 500);
  }
}

export const config = {
  runtime: 'experimental-edge',
};
