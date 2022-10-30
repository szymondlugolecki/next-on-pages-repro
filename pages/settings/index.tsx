// Hooks
import { useRouter } from 'next/router';

// Components
import { Container, Group, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Loading } from '../../components/Loading/Loading';

// Types

// Styles

export default function ProfilePage() {
  const { push } = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/login');
    },
  });

  if (status === 'loading') return <Loading />;

  // const joinedDate = new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(new Date(user.metadata.creationTime)) || '-';
  // const joinedDate = session.user.metadata.creationTime || '-';

  return (
    <Container>
      <Group position="left">
        {/* {user.vip && (
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
            {!user.vip && (<Text color="grey">Status: Regular</Text>)} */}
      </Group>
      <Group position="left">
        {/* <Avatar src={user.photoURL} size={240} radius="md" color="blue" /> */}
        <Stack align="flex-start" justify="flex-start">
          {/* <Text>{user.displayName}</Text> */}
          {/* <Text>Member since • {joinedDate}</Text> */}
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
