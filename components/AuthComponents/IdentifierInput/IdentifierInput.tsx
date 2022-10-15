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

export default function IdentifierInput({ form }: { form: UseFormReturnType<AuthForm> }) {
  return (
    <TextInput
      required
      label="Identifier"
      placeholder="Email or username"
      value={form.values.identifier}
      onChange={(event) => form.setFieldValue('identifier', event.currentTarget.value)}
      error={form.errors.identifier}
    />
  );
}
