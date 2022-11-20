import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import Loading from '../../components/Layout/Loading';
import httpClient, { handleAxiosError } from '../../lib/axiosClient';
import { formValidators } from '../../lib/edgeFunctions';
import { showError, showSuccess } from '../../lib/functions';

export default function Welcome() {
  const { push } = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/auth/login');
    },
  });

  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [unavailableNames, setUnvailableNames] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const addAvailableName = (name: string) =>
    setAvailableNames((previousState: string[]) => [...previousState, name]);
  const addUnavailableName = (name: string) =>
    setUnvailableNames((previousState: string[]) => [...previousState, name]);

  const checkAvailability = async (name: string) => {
    try {
      const result = await httpClient.get('nickname/available', {
        params: {
          nickname: name,
        },
      });
      if (result.data.available === true) addAvailableName(name);
      else addUnavailableName(name);
    } catch (error) {
      const faunaError = handleAxiosError(error);
      console.error(faunaError);
    }
  };

  const updateNickname = async (name: string) => {
    try {
      await httpClient.post('nickname/update', { nickname: name });

      // Success
      // Block & Notify & Redirect
      addUnavailableName(name);
      setAvailableNames((available) => {
        available.splice(available.indexOf(name), 1);
        return available;
      });
      showSuccess(`Nickname changed`);
      await httpClient.get('auth/session?update');
      push('/play');
    } catch (error: any) {
      const axiosError = handleAxiosError(error);
      showError(axiosError);
    }
  };

  const NicknameRequirements = () => {
    if (nicknameError)
      return (
        <Text color='red' size='sm' mb='sm'>
          <Center inline>
            <X size={14} />
            <Box ml={7}>{nicknameError}</Box>
          </Center>
        </Text>
      );
    else return null;
  };

  const NicknameAvailabilityStatus = () => {
    if (unavailableNames.includes(nickname)) return <X size={14} strokeWidth={4} color='red' />;
    if (availableNames.includes(nickname)) return <Check size={14} strokeWidth={4} color='green' />;

    return null;
  };

  const disableCheckButton =
    nicknameError !== null || nickname.length === 0 || unavailableNames.includes(nickname);

  if (status === 'loading') return <Loading />;

  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <Title color='green.4' order={1}>
          Welcome to geopolis.io
        </Title>
        <Text>Enter a nickname (you can do it later, but only once)</Text>
        <Group mt='sm' grow>
          <TextInput
            placeholder='Your nickname'
            size='md'
            value={nickname}
            onChange={(event) => {
              const inputNickname = event.currentTarget.value;
              setNickname(inputNickname);
              setNicknameError(formValidators.nickname(inputNickname));
            }}
            rightSection={<NicknameAvailabilityStatus />}
          />
        </Group>
        <NicknameRequirements />
        <Group grow mt='sm'>
          <Button
            disabled={disableCheckButton}
            color='teal'
            size='sm'
            onClick={() => checkAvailability(nickname)}
          >
            Check availability
          </Button>
          <Button
            disabled={!availableNames.includes(nickname)}
            color='green'
            onClick={() => updateNickname(nickname)}
          >
            Confirm
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
