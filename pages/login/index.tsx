import React from 'react';
import { useForm, useToggle, upperFirst } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Container,
  Center,
  Box,
} from '@mantine/core';
import { BrandGoogle, At, Check, X } from 'tabler-icons-react';
import { signIn } from 'next-auth/react';
// import { GoogleButton, TwitterButton } from '../SocialButtons/SocialButtons';

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

export default function Login(props: PaperProps<'div'>) {
  const [type, toggle] = useToggle('login', ['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      nickname: '',
      password: '',
      terms: true,
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Welcome to <b>Geopolis</b>, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          {/* <GoogleButton radius="xl">Google</GoogleButton> */}
          {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
          <Button leftIcon={<BrandGoogle size={18} />}>Google</Button>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form
          onSubmit={form.onSubmit(() =>
            signIn('credentials', { email: form.values.email, password: '' })
          )}
        >
          <Group direction="column" grow>
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
          </Group>

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
            <Button type="submit">{upperFirst(type)}</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
