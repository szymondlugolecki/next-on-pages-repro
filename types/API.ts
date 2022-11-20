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
  picture?: string;
  nickname: string;
  vip: boolean;
  banned: boolean;
}

export interface PrivateUser extends PublicUser {
  email: string;
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
