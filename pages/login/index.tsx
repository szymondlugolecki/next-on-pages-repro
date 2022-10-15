import { useRouter } from 'next/router';

import Auth from '../../components/AuthComponents/Auth/Auth';
import AuthHook from '../../lib/authHook';
import { Loading } from '../../components/Loading/Loading';

export default function Login() {
  const { push } = useRouter();

  const { status } = AuthHook({
    onAuthenticated() {
      push('/play');
    },
  });

  if (status === 'unauthenticated') return <Auth />;
  return <Loading />;
}
