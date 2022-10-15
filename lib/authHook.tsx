import { useContext, useEffect, useState } from 'react';

import { UserContext } from './userContext';

export default function AuthHook({
  onUnauthenticated,
  onAuthenticated,
}: {
  onUnauthenticated?: () => void;
  onAuthenticated?: () => void;
}) {
  const { checkLogin, setUser, user } = useContext(UserContext) || {};

  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');

  useEffect(() => {
    if (!checkLogin) return;
    checkLogin().then((response) => {
      if (response.logged === true) setStatus('authenticated');
      else setStatus('unauthenticated');
      if (setUser) setUser(response.user);
    });
  }, [user]);

  if (onUnauthenticated && status === 'unauthenticated') onUnauthenticated();
  if (onAuthenticated && status === 'authenticated') onAuthenticated();

  return { status, user: user ?? null };
}
