// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { ChallengeSolo } from '../../../components/ChallengeSolo/ChallengeSolo';
import { Loading } from '../../../components/Loading/Loading';
import { Container, Paper } from '@mantine/core';

// Types
import { Region } from '../../../types/Types';
import { GetServerSideProps } from 'next';

// Styles
import styles from '../../../pagesCss/PlayGamemode.styles';

// Client-Side Data & Functions
import { regions } from '../../../scripts/client';

const gamemodes = ['learn', 'challenge'];

export default function PlayGamemode() {
  const { push, query } = useRouter();
  const { classes } = styles();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      push('/login');
    },
  });

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
      regions: (arr: Region[]) => arr.every((region) => regions.includes(region)),
    },
  });

  const { gamemode } = query;
  if (!gamemode || typeof gamemode !== 'string' || !gamemodes.includes(gamemode)) push('/play');

  if (status === 'loading') return <Loading />;

  return (
    <Container className={classes.container}>
      <Paper radius="md" p="xl" withBorder>
        {gamemode === 'challenge' && <ChallengeSolo />}
      </Paper>
    </Container>
  );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { gamemode } = params;
  if (!gamemodes.includes(gamemode)) {
    return {
      redirect: {
        destination: '/play',
        permanent: false,
      },
    };
  }
  return {
    props: {}, // will be passed to the page component as props
  };
};
