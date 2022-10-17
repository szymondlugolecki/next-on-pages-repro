import { useEffect, useState } from 'react';
import { useUser } from './userContext';

export default function AuthHook({
  onUnauthenticated,
}: {
  onUnauthenticated?: () => void;
}) {
  const { checkLogin, setUser, user } = useUser();

  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');

  useEffect(() => {
    if (user === null && status === 'authenticated') setStatus('unauthenticated');
  }, [user]);

  useEffect(() => {
    if (!checkLogin) return;
    checkLogin().then((response) => {
      if (response.logged === true) setStatus('authenticated');
      else setStatus('unauthenticated');
      setUser(response.user);
    });
  }, []);

  if (onUnauthenticated && status === 'unauthenticated') onUnauthenticated();
  return { status, user };
}
