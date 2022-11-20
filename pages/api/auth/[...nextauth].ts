import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { emailToNickname, getUserByEmail, handleFaunaError } from '../../../lib/edgeFunctions';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismaClient';

const initialValues = (nickname: string) => ({
  nickname,
  vip: false,
  banned: false,
  ducats: 0,
  nChanges: 1,
  picture: null,
});

const aDay = 60 * 60 * 24;

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const emailOptions = {
    from: process.env.NO_REPLY_EMAIL,
    server: {
      host: process.env.EMAIL_SERVER,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    },
  };
  return NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    session: {
      maxAge: aDay * 14, // 14 days
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user, isNewUser }) {
        if (user?.email && isNewUser === true) {
          try {
            const genericNickname = emailToNickname(user.email);

            await setInitialValues(user.email, genericNickname);
            token.user = initialValues(genericNickname);
          } catch (error) {
            handleFaunaError(error);
          }
        }

        if (req.url === '/api/auth/session?update' && token.email) {
          try {
            // @ts-ignore
            const { data } = await getUserByEmail(token.email);
            const { vip, ducats, nChanges, nickname, picture } = data;

            token.user = { vip, ducats, nChanges, nickname, picture };
            console.log('*********** UPDATED USER ***********', token.user);
          } catch (error) {
            handleFaunaError(error);
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (token && token.user) {
          session.user = { ...token.user, email: token.email };
        }

        return session;
      },
    },
    pages: {
      signIn: '/auth/login',
      verifyRequest: '/auth/verify',
      signOut: '/auth/signout',
      newUser: '/auth/welcome',
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_SECRET_KEY || '',
      }),
      EmailProvider(emailOptions),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    theme: {
      colorScheme: 'auto',
      brandColor: '#25262b', // Hex color code
      logo: 'favicon.svg', // Absolute URL to image
      buttonText: '#40c057', // Hex color code
    },
    debug: true,
  });
};

export default auth;

/*

Type 
'(credentials: Record<"email" | "password", string> | undefined) => 
Promise<Record<"email" | "password", string> | null | undefined>' 

is not assignable to type 
'(credentials: Record<"email" | "password", string> | undefined, 
req: Pick<RequestInternal, "headers" | "body" | "query" | "method">) => 
Awaitable<...>'.

*/
