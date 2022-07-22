import NextAuth from 'next-auth';

// import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
// import redis from '../../../scripts/redis';

import { providers } from '../../../exports/NextAuth';

console.log('JWT_SECRET', process.env.JWT_SECRET);

export default NextAuth({
  debug: true,
  secret: process.env.JWT_SECRET,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24h
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers,
  // adapter: UpstashRedisAdapter(redis),
  callbacks: {
    session({ session, token, user }) {
      console.log('SESSION CALLBACK', 'session', session);
      console.log('SESSION CALLBACK', 'token', token);
      console.log('SESSION CALLBACK', 'user', user);

      return session; // The return type will match the one returned in `useSession()`
    },
    jwt({ token, user, account, isNewUser, profile }) {
      console.log('JWT CALLBACK', 'token', token);
      console.log('JWT CALLBACK', 'account', account);
      console.log('JWT CALLBACK', 'user', user);
      if (user) {
        token.id = user.id;
      }

      return token;
    },
  },
});
