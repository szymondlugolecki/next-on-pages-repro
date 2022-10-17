import { Dispatch, SetStateAction } from 'react';

export interface APIError {
  status: number;
  name: string;
  message: string;
  details: Record<string, string>;
}

// User

export interface UserAct {
  user: UserResponse | null;
  setUser: Dispatch<SetStateAction<UserResponse | null>>;
  status: 'authenticated' | 'unauthenticated' | 'loading',
  doLogout: () => Promise<void>;
  checkLogin: () => Promise<
    | {
      logged: boolean;
      user: UserResponse;
    }
    | {
      logged: boolean;
      user: null;
    }
  >;
  doGoogleCallback(values: any): Promise<string | any[]>;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  nickname: string | null;
  ducats: number;
  avatar: string | null;
  vip: boolean;
}

export interface LoginSuccessful {
  status: 'Authenticated'
  user: UserResponse;
}

export interface LogoutSuccessful {
  message: 'ok',
  success: true,
}

export interface AuthUnsuccessful {
  data: null;
  error: APIError;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface UserType {
  nickname: string;
}
