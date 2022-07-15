import {
  RingProgress,
  Stack,
  Text,
  Button,
  Container,
  Group,
  Paper,
  Center,
  SimpleGrid,
} from '@mantine/core';
import { Stats } from '../../components/Stats/Stats';

import styles from '../../pagesCss/Play.styles';

import { LearnModal } from '../../components/LoginModal/LoginModal';

interface StatsProps {
  data: {
    label: string;
    stats: string;
    progress: number;
    color: string;
    icon: 'up' | 'down';
  }[];
}

export default function PlayPage() {
  const { classes } = styles();

  const statsLearnData: StatsProps = {
    data: [
      { label: 'Correct Answers', stats: '15230', progress: 89, color: 'green', icon: 'up' },
      { label: 'Games Won', stats: '1024', progress: 78, color: 'blue', icon: 'up' },
      { label: 'Play Time', stats: '15 hours', progress: 24, color: 'red', icon: 'down' },
    ],
  };

  const statsChallengeData: StatsProps = {
    data: [
      { label: 'Correct Answers', stats: '11203', progress: 92, color: 'green', icon: 'up' },
      { label: 'Games Won', stats: '685', progress: 96, color: 'blue', icon: 'up' },
      { label: 'Current Win-Streak', stats: '2', progress: 40, color: 'red', icon: 'down' },
    ],
  };

  return (
    <Container className={classes.container}>
      <Group position="center" grow={true} direction="row" spacing="xl">
        <Stack
          align="center"
          justify="center"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            height: 200,
            borderRadius: 10,
          })}
        >
          <Text size="xl" weight="bolder">
            Practice alone
          </Text>

          <Button
            variant="gradient"
            gradient={{ from: 'green', to: 'lime' }}
            radius="sm"
            size="xl"
            uppercase={true}
          >
            LEARN
          </Button>
        </Stack>
        <Stack
          align="center"
          justify="center"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            height: 200,
            borderRadius: 10,
          })}
        >
          <Text size="xl" weight="bolder">
            Compete with others
          </Text>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'indigo' }}
            radius="sm"
            size="xl"
            uppercase={true}
          >
            CHALLENGE
          </Button>
        </Stack>
      </Group>
      {/* Play buttons: Learn mode | Challenge mode */}
      {/* Basic Stats */}
      {/* Login Bonus (should auto appear in a modal after logging in, instead of manually claiming it) */}
      {/*  */}
      <Stats data={statsLearnData.data} />
      <Stats data={statsChallengeData.data} />
    </Container>
  );
}
