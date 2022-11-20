import { useScrollIntoView } from '@mantine/hooks';

import { useSession } from 'next-auth/react';
import { HomeFirst } from '../../components/HomeFirst/HomeFirst';
import { HomeSecond } from '../../components/HomeSecond/HomeSecond';
import Loading from '../../components/Layout/Loading';

export default function Home() {
  const { status } = useSession();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });

  if (status === 'loading') return <Loading />;

  return (
    <div>
      <HomeFirst scrollFunc={scrollIntoView} />
      <HomeSecond targetRef={targetRef} />
    </div>
  );
}
