// Hooks
import { useRouter } from 'next/router';

// Components
import { Group, HoverCard, Paper, Tabs, Text } from '@mantine/core';
import GameHandler from '../../components/GameHandler';
import Loading from '../../components/Layout/Loading';

// Types

// Styles

import { availableGamemodes, gamemodes } from '../../lib/constants';
import { capitalize } from '../../lib/functions';
import { Gamemode } from '../../types/Game';
import { useAuth } from '../../lib/swrClient';

export default function PlayPage() {
  const { query } = useRouter();
  const { useSession } = useAuth();
  const { status } = useSession();

  if (status === 'loading') return <Loading />;

  const gameModeFormat = (gamemode: Gamemode) => capitalize(gamemode.split(':').join(' '));

  const comingSoon = (gamemode: Gamemode) => (
    <HoverCard shadow='md' withArrow>
      <HoverCard.Target>
        <Text>{gameModeFormat(gamemode)}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group position='left' noWrap>
          <Text size='sm' weight='bold'>
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
    <Tabs.Panel key={index} value={gamemode} pt='xs'>
      <Paper shadow='xl' radius='md' p='lg' withBorder>
        <GameHandler gamemode={gamemode} />
      </Paper>
    </Tabs.Panel>
  ));

  return (
    <Group position='center' grow spacing='xl'>
      <Tabs value={query.activeTab as string}>
        {gameModeTabs}
        {gameModePanels}
      </Tabs>
    </Group>
  );
}
