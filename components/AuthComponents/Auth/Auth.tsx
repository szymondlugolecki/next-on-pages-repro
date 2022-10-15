// Hooks
import { useContext } from 'react';
import { useToggle } from '@mantine/hooks';
import axios from 'axios';
import { useForm } from '@mantine/form';
import router, { useRouter } from 'next/router';

// Components
import { Text, Paper, Group, Stack, Button, Divider, Anchor, Container } from '@mantine/core';
import { BrandGoogle } from 'tabler-icons-react';
import Link from 'next/link';
import SignUpForm from '../SignUpForm/SignUpForm';
import LoginForm from '../LoginForm/LoginForm';

// Types
import { AuthForm } from '../../../types/GameplayTypes';

// Styles

// Client-Side Constants & Functions
import {
  capitalize,
  showError,
  showSuccess,
  validators,
} from '../../../lib/functions';
import { UserContext } from '../../../lib/userContext';
import { LoginSuccessful, UserResponse } from '../../../types/API';
import instance from '../../../lib/api';

export default function Auth() {
  const { setUser } = useContext(UserContext) || {};
  const { push } = useRouter();
  const [type, toggleType] = useToggle<'login' | 'register'>(['login', 'register']);

  const form = useForm({
    initialValues: {
      identifier: '',
      email: '',
      username: '',
      password: '',
      terms: false,
    } as AuthForm,
    validate:
      type === 'register'
        ? { email: validators.email, password: validators.password, username: validators.username }
        : {
            password: validators.password,
            identifier: validators.identifier,
          },
  });

  const loginUser = async ({ identifier, password }: AuthForm) => {
    // Make sign up API call
    try {
      const {
        data: { user },
      } = await instance.post<LoginSuccessful>('/auth/local', { identifier, password });

      if (setUser) {
        console.log('setting the user', user);
        setUser(user);
      }

      // Success
      showSuccess('Successfully logged in');

      // Redirect
      const { pathname } = router;
      if (pathname === '/login') push('/play');
    } catch (error: any) {
      if (error && error.error && error.error.message) {
        console.error('!Error!', error.error.message || '???');
      } else if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const registerUser = async (values: AuthForm) => {
    if (form.values.terms !== true) return showError('You must accept the terms');
    try {
      // Make sign up API call
      const { email, username, password } = values;
      await instance.post<{ user: UserResponse }>('/auth/local/register', { email, username, password });

      // Success
      showSuccess('Successfully created an account. Check your email');
      toggleType('login');
      return true;
    } catch (error: any) {
      if (error && error.error && error.error.message) {
        console.error('!Error!', error.error.message || '???');
      } else if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  };

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to <b>Geopolis</b>, {type} with
        </Text>
        <Group grow mb="md" mt="md">
          <Link passHref href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/connect/google`}>
            <Button variant="outline" leftIcon={<BrandGoogle size={18} />}>
              Google
            </Button>
          </Link>
        </Group>

        <Divider label="Or continue with email/username" labelPosition="center" mt="lg" mb="sm" />

        <form
          onSubmit={form.onSubmit(() => {
            if (type === 'register') registerUser(form.values);
            else loginUser(form.values);
          })}
        >
          <Stack>
            {type === 'register' && <SignUpForm form={form} />}
            {type === 'login' && <LoginForm form={form} />}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="gray"
              onClick={() => toggleType()}
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
