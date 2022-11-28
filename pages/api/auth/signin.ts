// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { emailToNickname, handleError, sendError } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';
import { sendLoginEmail } from '../../../lib/server/SESClient';
// import * as jose from 'jose';
// import createRefreshToken from '../../../lib/server/createRefreshToken';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  try {
    const { email }: { email: string } = await req.json();
    const cleanEmail = email.toLowerCase().trim();

    // Generate a verification token
    const verificationID = crypto.randomUUID();

    // Update verification token
    // If user does not exist, create user
    await client.user.upsert({
      where: { email: cleanEmail },
      update: { verifyID: verificationID },
      create: { email: cleanEmail, nickname: emailToNickname(cleanEmail) },
    });

    // Send email with verification token
    await sendLoginEmail({ userEmail: email, verificationID });

    // If this email is correct, we will send a verification link
    return Response.redirect('/verify', 200);
    // return sendSuccess({ data: { success: true } });
  } catch (error) {
    return handleError(error, {
      message: 'Unexpected error. Make sure the email is correct',
      code: 400,
    });
  }
}
