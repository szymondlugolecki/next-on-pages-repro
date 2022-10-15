import { useState, createContext, ReactNode } from 'react';
import instance from './api';
import { UserAct, UserResponse } from '../types/API';
import { parseError } from './functions';

export const UserContext = createContext<UserAct | null>(null);

export default ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [jwt, setJwt] = useState<null | string>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  async function doGoogleCallback(values: any) {
    try {
      const response = await instance.post('/api/auth/google/callback', values);
      return ['OK', response.data.message];
    } catch (error: any) {
      return parseError(error);
    }
  }

  const doLogout = async () => {
    const response = await instance.post('/api/auth/logout');
    if (response.data.message !== 'success') return;
    setUser(null);
    // router.push('/user/login');
  };

  async function checkLogin() {
    try {
      const resp = await instance.get('/users/me');
      return { logged: true, user: resp.data.user as UserResponse };
    } catch (error: any) {
      return { logged: false, user: null };
    }
  }

  const useract: UserAct = {
    user,
    setUser,
    loggingIn,
    doLogout,
    setLoggingIn,
    checkLogin,
    jwt,
    setJwt,
    doGoogleCallback,
  };

  return <UserContext.Provider value={useract}>{children}</UserContext.Provider>;
};
