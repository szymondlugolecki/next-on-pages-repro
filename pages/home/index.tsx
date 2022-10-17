import React from 'react';
import { useScrollIntoView } from '@mantine/hooks';

import { HomeFirst } from '../../components/HomeFirst/HomeFirst';
import { HomeSecond } from '../../components/HomeSecond/HomeSecond';
import AuthHook from '../../lib/authHook';

export default function Home() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });

  AuthHook({});

  return (
    <div>
      <HomeFirst scrollFunc={scrollIntoView} />
      <HomeSecond targetRef={targetRef} />
    </div>
  );
}
