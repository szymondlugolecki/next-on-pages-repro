import { Redis } from '@upstash/redis';

// Troubleshooting: ReferenceError: fetch is not defined
// If you are running on nodejs v17 and earlier, fetch will not be natively supported.
// Platforms like Vercel, Netlify, Deno, Fastly etc. provide a polyfill for you.
// But if you are running on bare node, you need to either specify a polyfill yourself or change the import path to:
// import { Redis } from "@upstash/redis/with-fetch";

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

export default redis;
