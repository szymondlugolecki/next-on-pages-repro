import type { NextRequest } from 'next/server';
import { handleFaunaError } from '../../../lib/edgeFunctions';
import faunaClient, { q } from '../../../lib/faunaClient';

export const config = {
  runtime: 'experimental-edge',
};

const isNicknameAvailable = (nickname: string) =>
  faunaClient.query(q.Not(q.Exists(q.Match(q.Index('user_by_nickname'), nickname))));

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');
  console.log('nickname', nickname);
  if (!nickname)
    return new Response(
      JSON.stringify({
        error: 'No nickname provided',
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      },
    );

  try {
    const available = await isNicknameAvailable(nickname);
    console.log('available', available);

    return new Response(
      JSON.stringify({
        available,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  } catch (error) {
    handleFaunaError(error);
  }
}
