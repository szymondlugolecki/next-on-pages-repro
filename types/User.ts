export type { User } from '@prisma/client';

export interface PublicUser {
  createdAt: Date;
  avatar: string | null;
  nickname: string;
  vip: boolean;
  banned: boolean;
}

export interface PrivateUser {
  createdAt: Date;
  banned: boolean;
  nickname: string;
  vip: boolean;
  email: string;
  nameChanges: number;
  avatar: string | null;
  ducats: number;
}
