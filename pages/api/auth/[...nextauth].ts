import NextAuth from 'next-auth';

// import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
// import redis from '../../../scripts/redis';

import { providers } from '../../../exports/NextAuth';

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
});
