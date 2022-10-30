import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Auth from '../../components/AuthComponents/Auth/Auth';
import { Loading } from '../../components/Loading/Loading';

export default function Login() {
  const { push } = useRouter();
  const { status } = useSession();

  if (status === 'loading') return <Loading />;
  if (status === 'authenticated') return push('/play');
  return <Auth />;
}
