import React from 'react';
import { useScrollIntoView } from '@mantine/hooks';

import { HomeFirst } from '../../components/HomeFirst/HomeFirst';
import { HomeSecond } from '../../components/HomeSecond/HomeSecond';

export default function Home() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });

  return (
    <div>
      <HomeFirst scrollFunc={scrollIntoView} />
      <HomeSecond targetRef={targetRef} />
    </div>
  );
}
