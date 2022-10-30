// Hooks

// Components
import { Container, Group, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Loading } from '../../../components/Loading/Loading';

// Types

// Styles

export default function ProfilePage() {
  const { status } = useSession();
  if (status === 'loading') return <Loading />;

  // const joinedDate = new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(new Date(user.createdAt)) || '-';

  return (
    <Container>
      <Group position="left">
        {/* <Avatar src={user.avatar} size={240} radius="md" color="blue" /> */}
        <Stack align="flex-start" justify="flex-start">
          {/* <Text>{user.nickname || 'Noname'}</Text> */}
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
