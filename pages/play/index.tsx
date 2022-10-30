// Hooks
import { useRouter } from 'next/router';

// Components
import { Container, Group, Tabs, HoverCard, Text, Paper } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Loading } from '../../components/Loading/Loading';
import { GameHandler } from '../../components/GameHandler/GameHandler';

// Types

// Styles
import styles from './Play.styles';

import { availableGamemodes, gamemodes } from '../../lib/constants';
import { Gamemode } from '../../types/GameplayTypes';
import { capitalize } from '../../lib/functions';

export default function PlayPage() {
  const { classes } = styles();
  const { query } = useRouter();
  const { status } = useSession();

  if (status === 'loading') return <Loading />;

  const gameModeFormat = (gamemode: Gamemode) => capitalize(gamemode.split(':').join(' '));

  const comingSoon = (gamemode: Gamemode) => (
    <HoverCard shadow="md" withArrow>
      <HoverCard.Target>
        <Text>{gameModeFormat(gamemode)}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group position="left" noWrap>
          <Text size="sm" weight="bold">
            Coming soon! 🔥
          </Text>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );

  const gameModeTabs = (
    <Tabs.List>
      {gamemodes.map((gamemode, index) => {
        const available = availableGamemodes.includes(gamemode);
        const disabled = { disabled: !available };
        const tabText = available ? gameModeFormat(gamemode) : comingSoon(gamemode);
        return (
          <Tabs.Tab key={index} value={gamemode} {...disabled}>
            {tabText}
          </Tabs.Tab>
        );
      })}
    </Tabs.List>
  );

  const gameModePanels = gamemodes.map((gamemode, index) => (
    <Tabs.Panel key={index} value={gamemode} pt="xs">
      <Paper shadow="xl" radius="md" p="lg" withBorder>
        <GameHandler gamemode={gamemode} />
      </Paper>
    </Tabs.Panel>
  ));

  return (
    <Container className={classes.container}>
      <Group position="center" grow spacing="xl">
        <Tabs value={query.activeTab as string}>
          {gameModeTabs}
          {gameModePanels}
        </Tabs>
      </Group>
      {/* <Stats data={statsLearnData.data} />
      <Stats data={statsChallengeData.data} /> */}
    </Container>
  );
}
