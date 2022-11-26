// Hooks
import { UseFormReturnType } from '@mantine/form';

// Components
import { Text, Button, Stack, Box } from '@mantine/core';

// Types
import type { GameCreationForm } from '../../types/Game';

// Styles
import styles from './AfterGameScreen.styles';

// Client-Side Constants & Functions

export function AfterGameScreen({
  data,
  gameForm,
}: {
  data: {
    title: string;
    stats: string;
    description: string;
  }[];
  gameForm: UseFormReturnType<GameCreationForm>;
}) {
  const { classes } = styles();
  const stats = data.map((stat) => (
    <div key={stat.title} className={classes.stat}>
      <Text className={classes.count}>{stat.stats}</Text>
      <Text className={classes.title}>{stat.title}</Text>
      <Text className={classes.description}>{stat.description}</Text>
    </div>
  ));

  return (
    <Stack spacing='xl'>
      <Text size='xl' weight='bold'>
        Congratulations
      </Text>

      <div className={classes.statsContainer}>{stats}</div>

      <Box>
        <Button onClick={() => gameForm.reset()}>Continue</Button>
      </Box>
    </Stack>
  );
}
