import { Button, Container, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '../../components/Layout/Loading';

import { At } from 'tabler-icons-react';

import { useEffect } from 'react';
import { formValidators } from '../../lib/edgeFunctions';
import { useAuth } from '../../lib/swrClient';

export default function Login() {
  const { push } = useRouter();
  const { useSession, signIn } = useAuth();
  const { status } = useSession();

  const form = useForm({
    initialValues: {
      email: '',
    } as { email: string },
    validate: {
      email: formValidators.email,
    },
  });

  useEffect(() => {
    if (status === 'authenticated') push('/play');
  }, [push, status]);

  if (status === 'loading') return <Loading />;

  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <form onSubmit={form.onSubmit(() => signIn(form.values.email))}>
          <Stack>
            <Text size='lg' weight={600} align='center'>
              Log in to Geopolis
            </Text>
            {/* <Group grow>
              <Button variant='outline' leftIcon={<BrandGoogle />} onClick={() => signIn('google')}>
                with Google
              </Button>
            </Group>

            <Divider label='or with an email' labelPosition='center' /> */}

            <TextInput
              required
              label='Email'
              icon={<At size={14} />}
              placeholder='hello@gmail.com'
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            />

            <Button type='submit'>Login</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
