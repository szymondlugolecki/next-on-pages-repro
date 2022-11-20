import 'next-auth';
import 'next-auth/jwt';

interface SubUser {
  ducats: number;
  vip: boolean;
  nChanges: number;
  nickname: string;
  picture: string | null;
}

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultSession.User, SubUser {
    email: string;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Omit<User, 'id'>;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends JWTType {
    email: string;
    user?: SubUser | undefined;
  }
}
