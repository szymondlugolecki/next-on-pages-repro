// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { ErrorResponse } from '../../../types/API';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  console.log('Cookies', req.cookies);
  return new Response(JSON.stringify({ message: 'foobar' } as ErrorResponse), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 401,
  });
}
