// Hooks

// Components
import { Avatar, Badge, Container, Group, Stack, Text, Title } from '@mantine/core';
import type { GetServerSideProps } from 'next';
// import { useSession } from 'next-auth/react';
import Loading from '../../../components/Layout/Loading';
import { handlePrismaError, timestampFormat } from '../../../lib/edgeFunctions';
import { PublicUser } from '../../../types';
import client from '../../../lib/prismaClient';
import { useAuth } from '../../../lib/swrClient';

// Types

// Styles

export default function ProfilePage({ user }: { user: PublicUser | null }) {
  const { useSession } = useAuth();
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
      <Group position='left' spacing='xl' align='flex-start' sx={() => ({ height: 170 })}>
        <Avatar
          src={user.avatar}
          size={170}
          radius='md'
          color='indigo'
          alt={`${user.nickname}'s avatar`}
          style={{ border: '3px solid rgba(255, 255, 255, .3)' }}
        />
        <Stack justify='space-between' sx={() => ({ height: '100%' })}>
          <Stack align='flex-start' justify='flex-start' spacing={0}>
            <StatusBadge />
            <Title order={1}>{user.nickname}</Title>
          </Stack>
          <Text mb='lg' size='md'>
            Member since • {timestampFormat(user.createdAt)}
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
  if (!queryNickname || typeof queryNickname !== 'string') return { props };

  try {
    const user = await client.user.findFirstOrThrow({
      where: {
        nickname: queryNickname,
      },
    });
    const { createdAt, banned, nickname, vip, avatar } = user;

    const publicUser: PublicUser = {
      nickname,
      avatar,
      vip,
      createdAt,
      banned,
    };

    return {
      props: {
        user: publicUser,
      },
    };
  } catch (error) {
    handlePrismaError(error);
    return { props };
  }
};
