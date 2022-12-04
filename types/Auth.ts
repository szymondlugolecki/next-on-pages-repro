import { AxiosResponse } from 'axios';
import { PrivateUser } from './User';

export interface Session {
  user: PrivateUser;
  expires: number;
}

export type UserStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthContext {
  signOut: () => Promise<AxiosResponse<any, any> | void | null>;
  signIn: (email: string) => Promise<AxiosResponse<any, any> | void | null>;
  useSession: () => UseSessionHook;
  // checkToken: (token: string) => Promise<
  //   | {
  //       accessToken: string;
  //     }
  //   | {
  //       accessToken: null;
  //     }
  // >;
}

export interface VerificationHook {
  isVerified: boolean;
  isLoading: boolean;
  isError: string | null;
}

export type UseSessionHook =
  | {
      data: Session;
      status: 'authenticated';
    }
  | { data: null; status: 'unauthenticated' }
  | { data: null; status: 'loading' };
