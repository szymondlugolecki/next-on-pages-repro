// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useRouter } from 'next/router';

// Components
import {
  Text,
  Group,
  Button,
  Divider,
  Switch,
  Chip,
  Stack,
  Card,
  SegmentedControl,
  Container,
  Box,
} from '@mantine/core';
import { Reset } from '@mantine/form/lib/types';
import { Hint } from '../Hint/Hint';

import { Answers } from '../Answers/Answers';

// Types
import type {
  Region,
  GameType,
  Dependence,
  Gamemode,
  GameCreationForm,
  Question,
} from '../../types/GameplayTypes';

// Styles
import styles from './AfterGameScreen.styles';

// Client-Side Constants & Functions

export function AfterGameScreen({
  data,
  gameReset,
}: {
  data: {
    title: string;
    stats: string;
    description: string;
  }[];
  gameReset: () => void;
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
    <Stack spacing="xl">
      <Text size="xl" weight="bold">
        Congratulations
      </Text>

      <div className={classes.statsContainer}>{stats}</div>

      <Box>
        <Button onClick={gameReset}>Continue</Button>
      </Box>
    </Stack>
  );
}
