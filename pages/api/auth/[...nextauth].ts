import { FaunaAdapter } from '@next-auth/fauna-adapter';
import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { emailToNickname, handleFaunaError } from '../../../lib/edgeFunctions';

import faunaClient, { q } from '../../../lib/faunaClient';

const setUserGenericNickname = (email: string, nickname: string) =>
  faunaClient.query(
    q.Let(
      {
        hasNickname: q.ContainsPath(
          ['data', 'nickname'],
          q.Get(q.Match(q.Index('user_by_email'), email)),
        ),
      },
      q.If(
        q.Not(q.Var('hasNickname')),
        q.Update(q.Select(['ref'], q.Get(q.Match(q.Index('user_by_email'), email))), {
          data: {
            nickname,
          },
        }),
        'Generic Nickname already exists',
      ),
    ),
  );

const aDay = 60 * 60 * 24;

// 25, 587 	(for unencrypted/TLS connections)
// 465 	(for SSL connections)

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
    adapter: FaunaAdapter(faunaClient),
    session: {
      maxAge: aDay * 14, // 14 days
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user, isNewUser }) {
        try {
          console.log('jwt()', user?.email, isNewUser);
          if (user?.email && isNewUser === true) {
            const genericNickname = emailToNickname(user.email);
            await setUserGenericNickname(user.email, genericNickname);
            token.nickname = genericNickname;
            console.log('bro just joined so I gave him a nickname:', token.nickname);
          }
        } catch (error) {
          handleFaunaError(error);
        }

        if (user?.nickname) token.nickname = user?.nickname;

        return token;
      },
      async session({ session, token }) {
        if (token && token.nickname) {
          session.user.nickname = token.nickname;
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
