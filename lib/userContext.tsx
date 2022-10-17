import { useState, createContext, ReactNode, useContext } from 'react';
import instance from './api';
import { UserAct, UserResponse, LogoutSuccessful } from '../types/API';
import { parseError } from './functions';

export const UserContext = createContext({} as UserAct);

export default ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');

  async function doGoogleCallback(values: any) {
    try {
      const response = await instance.post('/api/auth/google/callback', values);
      return ['OK', response.data.message];
    } catch (error: any) {
      return parseError(error);
    }
  }

  const doLogout = async () => {
    const response = await instance.get<LogoutSuccessful>('/auth/logout');
    if (response.data.success !== true) return;
    setUser(null);
  };

  const checkLogin = async () => {
    try {
      const response = await instance.get('/users/me');
      setStatus('authenticated');
      setUser(response.data);
      return { logged: true, user: response.data as UserResponse };
    } catch (error: any) {
      setStatus('unauthenticated');
      return { logged: false, user: null };
    }
  };

  const useract: UserAct = {
    user,
    setUser,
    status,
    doLogout,
    checkLogin,
    doGoogleCallback,
  };

  return <UserContext.Provider value={useract}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
