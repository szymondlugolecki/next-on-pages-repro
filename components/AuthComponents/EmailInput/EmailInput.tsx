// Hooks
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import router, { useRouter } from 'next/router';

// Components
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
import { BrandGoogle, At, Check, X } from 'tabler-icons-react';

// Types
import { Credentials, AuthForm } from '../../../types/GameplayTypes';
import { UseFormReturnType } from '@mantine/form';

// Styles

// Client-Side Constants & Functions

export default function EmailInput({ form }: { form: UseFormReturnType<AuthForm> }) {
  return (
    <TextInput
      required
      label="Email"
      icon={<At size={14} />}
      placeholder="hello@gmail.com"
      value={form.values.email}
      onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
      error={form.errors.email}
    />
  );
}
