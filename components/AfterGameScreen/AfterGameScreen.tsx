// Hooks
import { UseFormReturnType } from '@mantine/form';

// Components
import { Text, Button, Stack, Box } from '@mantine/core';

// Types
import type { GameCreationForm } from '../../types/Game';

// Styles
import styles from './AfterGameScreen.styles';
import { gameDataToStats } from '../../lib/client/gameStats';

// Client-Side Constants & Functions

export function AfterGameScreen({ gameForm }: { gameForm: UseFormReturnType<GameCreationForm> }) {
  const correctAnswers = gameForm.values.questions.map((c) => c.correctAI || 1);
  const allStats = gameDataToStats({
    gameForm,
    correctAnswers,
  });

  console.log(allStats);
  const { classes } = styles();
  const statsElement = allStats.map((statistic) => (
    <div key={statistic.name} className={classes.stat}>
      <Text className={classes.count}>{statistic.value}</Text>
      <Text className={classes.title}>{statistic.name}</Text>
      <Text className={classes.description}>{statistic.description}</Text>
    </div>
  ));

  return (
    <Stack spacing='xl'>
      <Text size='xl' weight='bold'>
        Congratulations
      </Text>

      <div className={classes.statsContainer}>{statsElement}</div>

      <Box>
        <Button onClick={() => gameForm.reset()}>Continue</Button>
      </Box>
    </Stack>
  );
}
