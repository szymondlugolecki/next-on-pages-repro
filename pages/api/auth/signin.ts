// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { emailToNickname, handleError, sendError } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';
import { sendLoginEmail } from '../../../lib/server/EmailClient';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  console.log('signin');

  try {
    const { email }: { email: string } = await req.json();
    const cleanEmail = email.toLowerCase().trim();

    console.log('signin', 'cleanEmail', cleanEmail);

    // Generate a verification token

    const verificationID = crypto.randomUUID();

    console.log('signin', 'verificationID', verificationID);

    // Update verification token
    // If user does not exist, create user
    const user = await client.user.upsert({
      where: { email: cleanEmail },
      update: { verifyID: verificationID },
      create: { email: cleanEmail, nickname: emailToNickname(cleanEmail) },
    });

    console.log('signin', 'user', user);

    // Send email with verification token
    await sendLoginEmail({ userEmail: email, verificationID });

    console.log('sigin', 'email has been sent');

    // If this email is correct, we will send a verification link
    return Response.redirect(`${process.env.NEXTAUTH_URL}/auth/verify`, 302);
    // return sendSuccess({ data: { success: true } });
  } catch (error) {
    console.error(error);
    return handleError(error, {
      message: 'Unexpected error. Make sure the email is correct',
      code: 400,
    });
  }
}
