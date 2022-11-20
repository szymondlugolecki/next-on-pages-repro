// Hooks
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';

// Components
import { Container, Paper } from '@mantine/core';
import { ChallengeSolo } from '../../../components/ChallengeSolo/ChallengeSolo';

// Types
import { Region } from '../../../types/GameplayTypes';

// Styles
import styles from './PlayGameMode.styles';

// Client-Side Data & Functions
import { allRegions, availableGamemodes } from '../../../lib/constants';

export default function PlayGamemode() {
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
      <Paper radius='md' p='xl' withBorder>
        {gamemode === 'challenge' && <ChallengeSolo gamemode='challenge:solo' />}
      </Paper>
    </Container>
  );
}
