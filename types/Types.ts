export interface ResponseData {
  error?: string;
  msg?: string;
}

export interface Credentials {
  password: string;
  email: string;
}

export interface UserDB {
  id: string;
  nickname: string;
  email: string;
  password: string;
  created: EpochTimeStamp;
}
