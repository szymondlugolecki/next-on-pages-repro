// Hooks
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import router, { useRouter } from 'next/router';

// Components
import { Text, Paper, Group, Stack, Button, Divider, Anchor, Container } from '@mantine/core';
import { BrandGoogle, Check, X } from 'tabler-icons-react';
import SignUpForm from '../SignUpForm/SignUpForm';
import LoginForm from '../LoginForm/LoginForm';

// Types
import { AuthForm, APIResponseJSON } from '../../../types/Types';

// Styles

// Client-Side Constants & Functions
import {
  capitalize,
  request,
  validateAuthForm,
  showError,
  showSuccess,
} from '../../../lib/functions';
import { setToken, unsetToken } from '../../../lib/auth';
import { useFetchUser } from '../../../lib/authContext';

export default function Auth() {
  const { push } = useRouter();
  const [type, toggle] = useToggle<'login' | 'register'>(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      nickname: '',
      password: '',
      terms: false,
    } as AuthForm,
    validate: validateAuthForm,
  });

  const loginUser = async ({ email, password }: AuthForm) => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/auth/local`,
        { data: JSON.stringify({ identifier: email, password }) },
        { config: 'post-json' }
      );
      const data = await response.json();
      console.log('LOGIN RESPONSE', data);
      setToken(data);
    } catch (error) {
      showError(JSON.stringify(error));
      console.log(error);
    }
  };

  const logout = () => unsetToken();

  const registerUser = async (values: AuthForm) => {
    try {
      // Make sign up API call
      const { email, password, nickname } = values;
      const response = await request(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/auth/local/register`,
        { data: JSON.stringify({ email, nickname, password }) },
        { config: 'post-json' }
      );
      const data: { jwt: string; user: any } = await response.json();

      // Destructure data & Handle errors
      const { error, msg } = data as APIResponseJSON;
      if (error) return showError(error);
      if (!msg);
      const msgParsed = JSON.parse(msg);
      if (!msgParsed.success)
        return showError(msgParsed.error || 'Unexpected error. Try again later...');

      console.log(55, 'data', data);
      if (!data.jwt) return showError('Unexpected error. Try again later...');

      // Successfully created an account
      // Show an alert
      showSuccess('Redirecting...');

      // Login & Redirect
      setTimeout(async () => {
        await loginUser(values);
        const { pathname } = router;
        console.log(pathname);
        if (pathname === '/login') push('/play').then(console.log);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to <b>Geopolis</b>, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <Button variant="outline" leftIcon={<BrandGoogle size={18} />}>
            Google
          </Button>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" mt="lg" mb="sm" />

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
