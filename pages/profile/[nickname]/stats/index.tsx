// Hooks
import { useRouter } from 'next/router';

// Components
import { Avatar, Container, Group, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Loading } from '../../../../components/Loading/Loading';

// Types

// Styles

import AuthHook from '../../../../lib/authHook';
import instance from '../../../../lib/api';
import { showError } from '../../../../lib/functions';
import { UserResponse } from '../../../../types/API';

export default function StatsPage() {
  const { push, query } = useRouter();

  const { user, status } = AuthHook({
    onUnauthenticated() {
      push('/login');
    },
  });

  const { nickname }: { nickname?: string | undefined } = query;

  const [queriedUser, setQueriedUser] = useState({} as UserResponse);

  useEffect(() => {
    const getUserStats = async () => {
        try {
            const { data } = await instance.get('/users/11');
            setQueriedUser(data);
        } catch (error) {
            showError('Couldn\'t load the data');
        }
    };
    if ([user?.nickname, 'me'].includes(nickname)) { getUserStats(); }
  }, [nickname]);

  if (!user || status !== 'authenticated') return <Loading />;

  const joinedDate = new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(new Date(user.createdAt)) || '-';

  if (status === 'authenticated') {
    return (
      <Container>
        <Group position="left">
            <Avatar src={queriedUser.avatar} size={240} radius="md" color="blue" />
            <Stack align="flex-start" justify="flex-start">
                <Text>{queriedUser.nickname}</Text>
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
  return <Loading />;
}
