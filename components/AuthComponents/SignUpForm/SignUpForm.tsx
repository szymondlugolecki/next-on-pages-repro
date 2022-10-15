// Hooks

// Components
import { TextInput, Text, Checkbox, Center, Box } from '@mantine/core';
import { Check, X } from 'tabler-icons-react';
import EmailInput from '../EmailInput/EmailInput';
import PasswordInput from '../PasswordInput/PasswordInput';

// Types
import { AuthForm } from '../../../types/GameplayTypes';
import { UseFormReturnType } from '@mantine/form';
import { validators } from '../../../lib/functions';

// Styles

// Client-Side Constants & Functions

const PasswordRequirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <Check size={14} /> : <X size={14} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
};

export default function SignUpForm({ form }: { form: UseFormReturnType<AuthForm> }) {
  const passwordMeets = validators.password(form.values.password) === null ? true : false;

  return (
    <>
      <TextInput
        required
        label="Username"
        placeholder="You can login with username and email"
        value={form.values.username}
        onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
        error={form.errors.username}
      />

      <EmailInput form={form} />
      <PasswordInput form={form} />

      <PasswordRequirement
        label="Password must have: at least 8 characters, a special character, an uppercase letter, a lowercase letter and a number"
        meets={passwordMeets}
      />

      <Checkbox
        label="I accept terms and conditions"
        checked={form.values.terms}
        onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
        styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
      />
    </>
  );
}
