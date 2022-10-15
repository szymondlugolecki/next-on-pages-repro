// Hooks
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import router, { useRouter } from 'next/router';

// Components
import {
  TextInput,
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
import IdentifierInput from '../IdentifierInput/IdentifierInput';
import PasswordInput from '../PasswordInput/PasswordInput';

// Types
import { Credentials, AuthForm } from '../../../types/GameplayTypes';
import { UseFormReturnType } from '@mantine/form';

// Styles

// Client-Side Constants & Functions

export default function LoginForm({ form }: { form: UseFormReturnType<AuthForm> }) {
  return (
    <>
      <IdentifierInput form={form} />
      <PasswordInput form={form} />
    </>
  );
}
