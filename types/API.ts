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
  loggingIn: boolean;
  doLogout: () => Promise<void>;
  setLoggingIn: Dispatch<SetStateAction<boolean>>;
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
  jwt: string | null;
  setJwt: Dispatch<SetStateAction<string | null>>;
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
}

export interface UserCreatedResponse {
  jwt?: string;
  user?: UserResponse;
  error?: APIError;
}

export interface LoginSuccessful {
  jwt: string;
  user: UserResponse;
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
