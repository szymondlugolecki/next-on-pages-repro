export interface ErrorResponse {
  error?: true;
  code?: number;
  message?: string;
}

export type SuccessResponse =
  | {
      success?: true;
      code?: number;
      message: string;
      data?: any;
    }
  | {
      success?: true;
      code?: number;
      message?: string;
      data: any;
    };

export interface APIError {
  status: number;
  name: string;
  message: string;
  details: Record<string, string>;
}

// User

export interface UserQuery {
  ref: object;
  ts: number;
  data: {
    email: string;
    emailVerified: object;
    nickname: string;
    vip: boolean;
    banned: boolean;
    ducats: number;
    nChanges: number;
    picture: string | null;
  };
}

export interface PublicUser {
  joined: number;
  image: string;
  nickname: string;
  vip: boolean;
  banned: boolean;
}

export interface PrivateUser {
  joined: string;
  banned: boolean;
  nickname: string | null;
  vip: boolean;
  email: string;
  nameChanges: number;
  image: string | null;
}

export type UserStatus = 'authenticated' | 'unauthenticated' | 'loading';
export interface UserDB {
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
