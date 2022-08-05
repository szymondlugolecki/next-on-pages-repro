import React from 'react';

import { HomeFirst } from '../../components/HomeFirst/HomeFirst';
import { HomeSecond } from '../../components/HomeSecond/HomeSecond';

import { Loading } from '../../components/Loading/Loading';

import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Loading />;

  return (
    <div>
      <HomeFirst />
      <HomeSecond />
    </div>
  );
}
