import { useRouter } from 'next/router';
import { axiosInstance, axiosErrorHandler } from '../../lib/axiosClient';
import { Group, Button, Stack, TextInput, Text } from '@mantine/core';
import { showError, showSuccess } from '../../lib/functions';

import { Check, X } from 'tabler-icons-react';

import type { UseFormReturnType } from '@mantine/form';
import type { NicknameChangeForm } from '../../types/ComponentProps';
import type { PrivateUser } from '../../types';

export default function NameChanger({
  form,
  user,
}: {
  form: UseFormReturnType<NicknameChangeForm>;
  user: PrivateUser;
}) {
  const { push } = useRouter();

  const allowedToChange = user.nameChanges > 0 || user.vip;

  console.log(
    'Allowed To Change',
    allowedToChange,
    'Name changes',
    user.nameChanges,
    'VIP',
    user.vip,
  );

  const addAvailableName = (name: string) =>
    form.setFieldValue('availableList', [...form.values.availableList, name]);
  const addUnavailableName = (name: string) =>
    form.setFieldValue('unavailableList', [...form.values.unavailableList, name]);

  const AvailabilityStatus = () => {
    if (form.values.unavailableList.includes(form.values.nickname))
      return <X size={14} strokeWidth={4} color='red' />;
    if (form.values.availableList.includes(form.values.nickname))
      return <Check size={14} strokeWidth={4} color='green' />;

    return null;
  };

  const changeNickname = async (name: string) => {
    if (!allowedToChange) return;
    try {
      await axiosInstance.post('nickname/update', { nickname: name });

      // Add to unavailableList & remove from availableList
      addUnavailableName(name);
      const newList = form.values.availableList.filter((nickname) => nickname !== name);
      form.setFieldValue('availableList', newList);

      showSuccess(`Nickname changed`);
      await axiosInstance.get('auth/session?update');
      push('/play');
    } catch (error: any) {
      const axiosError = axiosErrorHandler(error);
      showError(axiosError);
    }
  };

  const checkIfAvailable = async (name: string) => {
    if (!allowedToChange) return;
    try {
      const {
        data: { data },
      } = await axiosInstance.get<{
        success: true;
        data: {
          available: boolean;
        };
      }>('nickname/available', {
        params: {
          nickname: name,
        },
      });
      if (data.available === true) addAvailableName(name);
      else addUnavailableName(name);
    } catch (error) {
      const axiosError = axiosErrorHandler(error);
      showError(axiosError);
    }
  };

  const handleCheck = async () => {
    form.setFieldValue('loading', true);
    await checkIfAvailable(form.values.nickname);
    form.setFieldValue('loading', false);
  };

  const knownToBeAvailable = form.values.availableList.includes(form.values.nickname);

  return (
    <Stack align='flex-end' spacing='md' style={{ width: '22rem' }}>
      <TextInput
        style={{ width: '100%' }}
        required
        label='Nickname'
        placeholder='Your nickname'
        maxLength={32}
        size='md'
        rightSection={<AvailabilityStatus />}
        // {...form.getInputProps('nickname', { withFocus: true })}
        value={form.values.nickname}
        onChange={(event) => form.setFieldValue('nickname', event.currentTarget.value)}
        disabled={!allowedToChange}
      />
      {allowedToChange ? (
        <Group style={{ width: '100%' }} grow>
          <Button
            color='indigo'
            onClick={handleCheck}
            type='button'
            loading={form.values.loading}
            disabled={
              !form.values.nickname.length ||
              form.values.unavailableList.includes(form.values.nickname) ||
              !allowedToChange
            }
          >
            Check availability
          </Button>
          <Button
            disabled={!knownToBeAvailable || !allowedToChange}
            onClick={() => changeNickname(form.values.nickname)}
            type='submit'
          >
            Change
          </Button>
        </Group>
      ) : (
        <Text size='sm' align='center' color='dimmed'>
          Buy VIP or Name Change Tokens in the Store if you want to change your nickname
        </Text>
      )}
    </Stack>
  );
}
