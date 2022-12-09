import { createContext, useState, useContext, useEffect } from 'react';
import useSWR from 'swr';
import { axiosInstance } from './axiosClient';

import type {
  Session,
  AuthContext as AuthContextType,
  SuccessResponse,
  UseSessionHook,
} from '../types';

const fetcher = async (url: string) => axiosInstance.get(url).then((res) => res.data);

const authContextDefaultValues: AuthContextType = {
  signOut: () => new Promise((resolve) => resolve()),
  signIn: () => new Promise((resolve) => resolve()),
  useSession: () => ({ status: 'loading', data: null }),
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValues);

export const useAuth = () => useContext(AuthContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  // const [mounted, setMounted] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  // const { mutate } = useSWRConfig();

  const { data, error } = useSWR<SuccessResponse<Session>>('auth/session', fetcher, {
    refreshInterval: 1000 * 60 * 10,
    revalidateOnFocus: false,
  });

  const signIn = async (email: string) => {
    try {
      await axiosInstance.post('auth/signin', { email });
    } catch (e) {
      console.error('Sign in error', e);
    }
    // finally {
    //   mutate('auth/session');
    // }
  };

  const signOut = async () => {
    try {
      await axiosInstance.post('auth/signout');
    } catch (e) {
      console.error('Sign in error', e);
    }
    // finally {
    //   mutate('auth/session');
    // }
  };

  useEffect(() => {
    if (!data && !error) setLoading(true);
    else setLoading(false);

    if (data?.data) setSession(data.data);
  }, [data, error]);

  const useSession = (): UseSessionHook => {
    if (session) return { data: session, status: 'authenticated' };
    if (loading) return { data: null, status: 'loading' };
    if (error) return { data: null, status: 'unauthenticated' };
    return { data: null, status: 'unauthenticated' };
  };

  const value = {
    signOut,
    signIn,
    useSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
