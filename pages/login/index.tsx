import React from 'react';

import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Stack,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Container,
  Center,
  Box,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';

import { GetServerSideProps } from 'next';

import router, { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

import { BrandGoogle, At, Check, X } from 'tabler-icons-react';

import { FormValues, Credentials } from '../../types/Types';

// import { capitalize } from '../../scripts/client';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <Check size={14} /> : <X size={14} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const registerError = (error: string) => {
  showNotification({ title: 'Error', message: error, autoClose: 10000, icon: <X /> });
  console.error(error);
};

const loginUser = async ({ email, password }: Credentials) =>
  await signIn('credentials', { password, email });

const redirectAfter = 1750;

export const capitalize = (text: string) => {
  return text
    .split(' ')
    .map((word: string) => {
      word = word.toUpperCase();
      return word.charAt(0) + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export default function Login() {
  const { push } = useRouter();
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      nickname: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  const registerUser = async (values: FormValues) => {
    try {
      const { email, password, nickname } = values;
      const data = JSON.stringify({ email, nickname, password });
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      const { error, msg } = await response.json();

      // unsuccessful register
      if (error) return registerError(error);

      // successful register
      showNotification({
        title: 'Success',
        message: `${msg}.\nRedirecting...`,
        autoClose: 10000,
        icon: <Check />,
      });

      // login & redirect
      setTimeout(async () => {
        await loginUser({ email, password });
        const { pathname } = router;
        console.log(pathname);
        if (pathname === '/login') push('/play').then(console.log);
      }, redirectAfter);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(type);

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to <b>Geopolis</b>, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <Button leftIcon={<BrandGoogle size={18} />}>Google</Button>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" mt="lg" mb="sm" />

        <form
          onSubmit={form.onSubmit(() => {
            if (type === 'register') registerUser(form.values);
            else loginUser(form.values);
          })}
        >
          <Stack>
            {type === 'register' && (
              <TextInput
                required
                label="Nickname"
                placeholder="Other players will see you by this name"
                value={form.values.nickname}
                onChange={(event) => form.setFieldValue('nickname', event.currentTarget.value)}
              />
            )}

            <TextInput
              required
              label="Email"
              icon={<At size={14} />}
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
            />

            {type === 'register' && (
              <PasswordRequirement
                label="Has at least 6 characters"
                meets={form.values.password.length > 5}
              />
            )}

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="gray"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit">{capitalize(type)}</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: '/play',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};
