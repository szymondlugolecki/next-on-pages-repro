// Hooks
import { useRouter } from 'next/router';

// Components
import { Avatar, Container, Group, Stack, Text, Highlight } from '@mantine/core';
import { Loading } from '../../components/Loading/Loading';

// Types

// Styles

import AuthHook from '../../lib/authHook';

export default function ProfilePage() {
  const { push } = useRouter();

  const { user, status } = AuthHook({
    onUnauthenticated() {
      push('/login');
    },
  });

  if (!user || status !== 'authenticated') return <Loading />;

  const joinedDate = new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(new Date(user.createdAt)) || '-';

    return (
      <Container>
        <Group position="left">
            {user.vip && (
              <Highlight
                align="center"
                highlight="VIP"
                highlightStyles={(theme) => ({
                backgroundImage:
                    theme.fn.linearGradient(45, theme.colors.lime[5], theme.colors.green[5]),
                fontWeight: 700,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              })}
              >
                Status: VIP 👑
              </Highlight>
            )}
            {!user.vip && (<Text color="grey">Status: Regular</Text>)}
        </Group>
        <Group position="left">
            <Avatar src={user.avatar} size={240} radius="md" color="blue" />
            <Stack align="flex-start" justify="flex-start">
                <Text>{user.nickname}</Text>
                <Text>Member since • {joinedDate}</Text>
            </Stack>
        </Group>
        <Group position="apart" px="xl">
            <Text>Games won</Text>
            <Text>Estimated Playtime</Text>
            <Text>Average Response Time</Text>
        </Group>
      </Container>
    );
}
