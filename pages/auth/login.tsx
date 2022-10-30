import { Button, Container, Divider, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';

import { At } from 'tabler-icons-react';

import { authValidators } from '../../lib/edgeFunctions';
// import type { LoginForm } from '../../types/GameplayTypes';

export default function Login() {
  const form = useForm({
    initialValues: {
      email: '',
    } as { email: string },
    validate: {
      email: authValidators.email,
    },
  });

  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <form onSubmit={form.onSubmit(async () => signIn('email', { email: form.values.email }))}>
          <Stack>
            <Text size='lg' weight={600} align='center'>
              Log in to Geopolis
            </Text>
            <Divider />

            <TextInput
              required
              label='Email'
              icon={<At size={14} />}
              placeholder='hello@gmail.com'
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            />

            <Divider my='xs' />
            <Button type='submit'>Login</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
