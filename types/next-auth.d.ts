import 'next-auth';
import 'next-auth/jwt';
import type { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends PrismaUser {
    email: string;
    name: string | null;
    image: string | null;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */

  interface JWTUser extends PrismaUser {}

  // interface User extends PrismaUser {
  //   email: string;
  //   name: string | null;
  //   image: string | null;
  // }

  // jwt({ token })
  interface JWT {
    user: JWTUser;
  }
}
