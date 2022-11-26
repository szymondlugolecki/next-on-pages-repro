// Hooks
import { useForm } from '@mantine/form';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { Avatar, Divider, Group, Paper, Title, Text } from '@mantine/core';
import Loading from '../../components/Layout/Loading';

// Types
import type { GetServerSideProps } from 'next';
import type { PrivateUser } from '../../types/API';
import type { NicknameChangeForm } from '../../types/ComponentProps';

import { formValidators, handlePrismaError, timestampFormat } from '../../lib/edgeFunctions';
import client from '../../lib/prismaClient';
import NameChanger from '../../components/NameChanger';

// Styles

const SettingsDivider = () => <Divider my='md' />;
const SettingsGroup = ({ children }: { children: JSX.Element[] | JSX.Element }) => (
  <Group position='apart' px='sm'>
    {children}
  </Group>
);
const SettingsSectionTitle = ({ title }: { title: string }) => <Title order={3}>{title}</Title>;

export default function SettingsPage({ user }: { user: PrivateUser }) {
  const { push } = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/auth/login');
    },
  });

  const form = useForm<NicknameChangeForm>({
    initialValues: {
      nickname: user.nickname ?? '',
      available: false,
      availableList: [],
      unavailableList: user.nickname ? [user.nickname] : [],
      loading: false,
    },
    validate: {
      nickname: formValidators.nickname,
    },
  });

  if (status === 'loading') return <Loading />;

  return (
    <Paper withBorder p='md'>
      <SettingsGroup>
        <SettingsSectionTitle title='Avatar' />
        <Avatar src={user.image} alt='Your profile picture' size={200} radius='xl' />
      </SettingsGroup>

      <SettingsDivider />

      <SettingsGroup>
        <SettingsSectionTitle title='Nickname' />
        <NameChanger form={form} user={user} />
      </SettingsGroup>

      <SettingsDivider />

      <SettingsGroup>
        <SettingsSectionTitle title='Name Changes' />
        <Text>{user.nameChanges}</Text>
      </SettingsGroup>

      <SettingsDivider />
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // PrivateUser
  const token = await getToken(ctx);
  if (!token) throw new Error('Authorization token not found');

  // Check the database
  try {
    const user = await client.user.findFirstOrThrow({
      where: {
        email: token.user.email,
      },
    });

    console.log('user', user);

    const { createdAt, banned, nickname, vip, email, nameChanges, image } = user;

    return {
      props: {
        user: {
          joined: timestampFormat(createdAt.getTime()),
          banned,
          nickname,
          vip,
          email,
          nameChanges,
          image,
        },
      },
    };
  } catch (error) {
    handlePrismaError(error);
    throw new Error('Unexpected error');
  }
};
