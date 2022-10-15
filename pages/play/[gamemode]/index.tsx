// Hooks
import { useContext, useEffect, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';

// Components
import { ChallengeSolo } from '../../../components/ChallengeSolo/ChallengeSolo';
import { Loading } from '../../../components/Loading/Loading';
import { Container, Paper } from '@mantine/core';

// Types
import { Region } from '../../../types/GameplayTypes';
import { GetServerSideProps } from 'next';

// Styles
import styles from './PlayGameMode.styles';

// Client-Side Data & Functions
import { allRegions, availableGamemodes } from '../../../lib/constants';
import { UserContext } from '../../../lib/userContext';

export default function PlayGamemode() {
  const { checkLogin } = useContext(UserContext) || {};
  const { push, query } = useRouter();
  const { classes } = styles();

  const form = useForm({
    initialValues: {
      dependence: true,
      capitalCities: false,
      map: false,
      flags: false,
      regions: ['europe'] as Region[],
      // mode: 0, // classic | speedrun
    },

    validate: {
      regions: (arr: Region[]) => arr.every((region) => allRegions.includes(region)),
    },
  });

  const { gamemode } = query;
  const gms = availableGamemodes.map((gm) => gm.split(':')[0]);
  if (!gamemode || typeof gamemode !== 'string' || !gms.includes(gamemode)) push('/play');

  // if (status === 'loading') return <Loading />;

  return (
    <Container className={classes.container}>
      <Paper radius="md" p="xl" withBorder>
        {gamemode === 'challenge' && <ChallengeSolo gamemode="challenge:solo" />}
      </Paper>
    </Container>
  );
}
