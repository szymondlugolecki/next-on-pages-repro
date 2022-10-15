// Hooks
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import router, { useRouter } from 'next/router';

// Components
import {
  TextInput,
  PasswordInput as PasswordUI,
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
import { BrandGoogle, At, Check, X } from 'tabler-icons-react';

// Types
import { Credentials, AuthForm } from '../../../types/GameplayTypes';
import { UseFormReturnType } from '@mantine/form';

// Styles

// Client-Side Constants & Functions

export default function PasswordInput({ form }: { form: UseFormReturnType<AuthForm> }) {
  return (
    <PasswordUI
      required
      label="Password"
      placeholder="Your password"
      value={form.values.password}
      onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
      error={form.errors.password}
    />
  );
}
