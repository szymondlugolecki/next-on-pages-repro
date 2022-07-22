import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { compare } from 'bcrypt';
import redis from '../scripts/redis';

import { UserDB } from '../types/Types';

export const providers = [
  Credentials({
    id: 'emailandpassword',
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    type: 'credentials',
    // @ts-ignore
    authorize: async (credentials) => {
      if (!credentials) return null;
      let { email, password } = credentials;

      email = email.toLowerCase();

      try {
        const userID: string | null = await redis.get(`rel:email:${email}`);
        if (!userID) return null;

        // @ts-ignore
        const user: UserDB = await redis.hgetall(userID);
        console.log(user ? 'User exists' : 'User does not exist, returning NULL!');

        // check password

        const checkPassword = await compare(password, user.password);
        console.log('checkPassword', checkPassword);
        if (!checkPassword) return null;

        const sessionUser = {
          id: userID,
          nickname: user.nickname,
          email,
        };

        // If no error and we have user data, return it
        if (user) return sessionUser;
        else return null;
        // Return null if user data could not be retrieved
      } catch (error) {
        console.error(error);
      }
    },
  }),
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  }),
];
