// import { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { handleError, sendError } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';
import { sendLoginEmail } from '../../../lib/server/SESClient';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST')
    return sendError({ message: 'Only POST method is allowed', code: 405 });

  try {
    const { email }: { email: string } = await req.json();
    // const cleanEmail = email.toLowerCase().trim();

    // Generate a verification token
    const verificationID = crypto.randomUUID();

    // // If user does not exist in the database
    // // Add user to the db
    // const user =
    //   (await client.user.findUnique({ where: { email: cleanEmail } })) ||
    //   (await client.user.create({
    //     data: { email: cleanEmail, nickname: emailToNickname(cleanEmail) },
    //   }));

    // Find user and

    await client.userTokens.

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
