// Hooks
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { ChallengeSolo } from '../../components/ChallengeSolo/ChallengeSolo';
import { Learn } from '../../components/Learn/Learn';
import { Stats } from '../../components/Stats/Stats';
import { Loading } from '../../components/Loading/Loading';
import { Container, Group, Tabs, HoverCard, Text, Paper } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';

// Types

// Styles
import styles from '../../pagesCss/Play.styles';

import { statsChallengeData, statsLearnData } from '../../scripts/client';

export default function PlayPage() {
  const { push, query } = useRouter();
  const { classes } = styles();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      push('/login');
    },
  });

  if (status === 'loading') return <Loading />;

  return (
    <Container className={classes.container}>
      <Group position="center" grow={true} spacing="xl">
        <Tabs value={query.activeTab as string}>
          <Tabs.List>
            <Tabs.Tab value="learn">Learn</Tabs.Tab>
            <Tabs.Tab value="challenge/solo">Challenge Solo</Tabs.Tab>
            <Tabs.Tab value="challenge/multiplayer" disabled>
              <HoverCard shadow="md" withArrow>
                <HoverCard.Target>
                  <Text>Challenge Multiplayer</Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Group position="left" noWrap={true}>
                    <Text size="sm" weight="bold">
                      Coming soon! 🔥
                    </Text>
                  </Group>
                </HoverCard.Dropdown>
              </HoverCard>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="learn" pt="xs">
            <Paper shadow="xl" radius="md" p="lg" withBorder>
              <Learn gamemode="learn" />
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="challenge/solo" pt="xs">
            <Paper shadow="xl" radius="md" p="lg" withBorder>
              <ChallengeSolo gamemode="challenge:solo" />
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="challenge/multiplayer" pt="xs">
            Settings tab content
          </Tabs.Panel>
        </Tabs>
      </Group>
      <Stats data={statsLearnData.data} />
      <Stats data={statsChallengeData.data} />
    </Container>
  );
}
