// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { ErrorResponse } from '../../../types';

export const config = {
  runtime: 'experimental-edge',
};

const NO_RETRY_HEADER = 'x-no-retry';

export default async function handler(req: NextRequest) {
  console.log(
    'cookies',
    req.cookies,
    'auth',
    req.headers.get('Authorization'),
    'x-no-retry',
    req.headers.get(NO_RETRY_HEADER),
  );
  return new Response(JSON.stringify({ message: 'Bro is unauthorized' } as ErrorResponse), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 401,
  });
}
