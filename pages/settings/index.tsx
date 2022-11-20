// Hooks
import { useForm } from '@mantine/form';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { Avatar, Button, Divider, Group, Paper, Stack, TextInput, Title } from '@mantine/core';
import { Check, X } from 'tabler-icons-react';
import Loading from '../../components/Layout/Loading';

// Types
import type { GetServerSideProps } from 'next';
import type { PrivateUser } from '../../types/API';
import type { NicknameChangeForm } from '../../types/ComponentProps';

import httpClient, { handleAxiosError } from '../../lib/axiosClient';
import {
  formValidators,
  getUserByEmail,
  handleFaunaError,
  timestampFormat,
} from '../../lib/edgeFunctions';
import { showError, showSuccess } from '../../lib/functions';

// Styles

export default function SettingsPage({ user }: { user: PrivateUser | null }) {
  const { push } = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/auth/login');
    },
  });

  const form = useForm<NicknameChangeForm>({
    initialValues: {
      nickname: '',
      available: false,
      availableList: [],
      unavailableList: [],
      loading: false,
    },
    validate: {
      nickname: formValidators.nickname,
    },
  });

  const addAvailableName = (name: string) =>
    form.setFieldValue('availableList', [...form.values.availableList, name]);
  const addUnavailableName = (name: string) =>
    form.setFieldValue('unavailableList', [...form.values.unavailableList, name]);

  const checkIfAvailable = async (name: string) => {
    try {
      const result = await httpClient.get('nickname/available', {
        params: {
          nickname: name,
        },
      });
      if (result.data.available === true) addAvailableName(name);
      else addUnavailableName(name);
    } catch (error) {
      const axiosError = handleAxiosError(error);
      showError(axiosError);
    }
  };

  const changeNickname = async (name: string) => {
    try {
      await httpClient.post('nickname/update', { nickname: name });

      // Add to unavailableList & remove from availableList
      addUnavailableName(name);
      const newList = form.values.availableList.filter((nickname) => nickname !== name);
      form.setFieldValue('availableList', newList);

      showSuccess(`Nickname changed`);
      await httpClient.get('auth/session?update');
      push('/play');
    } catch (error: any) {
      const axiosError = handleAxiosError(error);
      showError(axiosError);
    }
  };

  const AvailabilityStatus = () => {
    if (form.values.unavailableList.includes(form.values.nickname))
      return <X size={14} strokeWidth={4} color='red' />;
    if (form.values.availableList.includes(form.values.nickname))
      return <Check size={14} strokeWidth={4} color='green' />;

    return null;
  };

  const handleCheck = async () => {
    form.setFieldValue('loading', true);
    await checkIfAvailable(form.values.nickname);
    form.setFieldValue('loading', false);
  };

  // const disableCheckButton =
  //   nicknameError !== null || nickname.length === 0 || unavailableNames.includes(nickname);

  const SettingsDivider = () => <Divider my='md' />;
  const SettingsGroup = ({ children }: { children: JSX.Element[] | JSX.Element }) => (
    <Group position='apart' px='sm'>
      {children}
    </Group>
  );
  const SettingsSectionTitle = ({ title }: { title: string }) => <Title order={3}>{title}</Title>;

  if (status === 'loading') return <Loading />;

  return (
    <Paper withBorder p='md'>
      <SettingsGroup>
        <SettingsSectionTitle title='Avatar' />
        <Avatar src={user?.picture} alt='Your profile picture' size={200} radius='xl' />
      </SettingsGroup>

      <SettingsDivider />

      <SettingsGroup>
        <SettingsSectionTitle title='Nickname' />
        <form onSubmit={form.onSubmit(async () => console.log('form submit'))}>
          <Stack align='flex-end' spacing='md'>
            <TextInput
              required
              label='Nickname'
              placeholder='Your nickname'
              size='md'
              rightSection={<AvailabilityStatus />}
              // {...form.getInputProps('nickname', { withFocus: true })}
              value={form.values.nickname}
              onChange={(event) => form.setFieldValue('nickname', event.currentTarget.value)}
            />
            <Group>
              <Button
                color='indigo'
                onClick={handleCheck}
                type='button'
                loading={form.values.loading}
              >
                Check availability
              </Button>
              <Button disabled onClick={() => changeNickname(form.values.nickname)} type='submit'>
                Change
              </Button>
            </Group>
          </Stack>
        </form>
      </SettingsGroup>

      <SettingsDivider />
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // PrivateUser
  const props = { user: null };
  const token = await getToken(ctx);
  if (!token) return { props };

  // Check the database
  try {
    const user = await getUserByEmail(token.email);
    if (!user) return { props };
    console.log('user', user);

    const {
      ts,
      data: { banned, nickname, vip, email, nChanges, picture },
    } = user;

    return {
      props: {
        user: {
          joined: timestampFormat(ts / 1000),
          banned,
          nickname,
          vip,
          email,
          nChanges,
          picture: picture || null,
        },
      },
    };
  } catch (error) {
    handleFaunaError(error);
    return { props };
  }
};
