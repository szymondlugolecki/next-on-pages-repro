// Hooks

// Components
import { Avatar, Badge, Container, Group, Stack, Text, Title } from '@mantine/core';
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Loading from '../../../components/Layout/Loading';
import { handlePrismaError, timestampFormat } from '../../../lib/edgeFunctions';
import { PublicUser } from '../../../types/API';
import client from '../../../lib/prismaClient';

// Types

// Styles

export default function ProfilePage({ user }: { user: PublicUser | null }) {
  const { status } = useSession();
  if (status === 'loading') return <Loading />;

  if (user === null)
    return (
      <Container>
        <Title order={1}>User not found</Title>
      </Container>
    );

  const StatusBadge = () => {
    if (user.vip === true)
      return (
        <Badge size='lg' variant='gradient' gradient={{ from: 'orange', to: 'red' }}>
          VIP 👑
        </Badge>
      );
    else
      return (
        <Badge size='lg' color='gray'>
          Regular
        </Badge>
      );
  };

  return (
    <Container>
      <Group position='left' spacing='xl' align='flex-start' sx={() => ({ height: 240 })}>
        <Avatar src={user.picture} size={240} radius='md' color='indigo' />
        <Stack justify='space-between' py='xs' sx={() => ({ height: '100%' })}>
          <Stack align='flex-start' justify='flex-start' spacing={0}>
            <StatusBadge />
            <Title order={1}>{user.nickname}</Title>
          </Stack>
          <Text mb='lg' size='md'>
            Member since • {user.joined}
          </Text>
        </Stack>
      </Group>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryNickname = params?.nickname;
  const props = { user: null };

  // Return if invalid nickname provided
  if (!queryNickname || Array.isArray(queryNickname)) return { props };

  try {
    // Database query
    const user = await client.user.findFirstOrThrow({
      where: {
        nickname: queryNickname,
      },
    });
    console.log('user', user);

    const { createdAt, banned, nickname, vip } = user;

    return {
      props: {
        user: {
          joined: timestampFormat(createdAt.getTime()),
          banned,
          nickname,
          vip,
        },
      },
    };
  } catch (error) {
    handlePrismaError(error);
    return { props };
  }
};
