import {
  Button,
  Checkbox,
  Container,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { At } from 'tabler-icons-react';
import { PasswordRequirement } from '../../components/Auth/PasswordRequirement';

import httpClient from '../../lib/axiosClient';
import { authValidators, getPasswordRequirements } from '../../lib/edgeFunctions';
import { showError } from '../../lib/functions';
import type { RegisterForm } from '../../types/GameplayTypes';

export default function Signup() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      terms: false,
    } as RegisterForm,
    validate: authValidators,
  });

  const requirements = getPasswordRequirements(form.values.password);
  const allRequirementsMet = requirements.every((r) => r.meets === true);
  const allowedToLogin =
    allRequirementsMet && form.values.email.length > 4 && form.values.terms === true;

  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <form
          onSubmit={form.onSubmit(async () => {
            try {
              const response = await httpClient.post('auth/register', form.values);
              console.log('response', response.data);
            } catch (error: any) {
              if (error.response) {
                console.log(error.response.status);
                console.error('Possibly invalid data 😥');
                showError('Error. Check if provided data is valid');
              } else if (error.request) {
                console.error('No response from server was received 😥');
                showError('No response from server was received 😥');
                // console.log(error.request);
              } else {
                showError('Unexpected error 😥');
                console.log('Error', error.message);
              }
            }
          })}
        >
          <Stack>
            <Text size='lg' weight={600} align='center'>
              Sign up to Geopolis
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
            <PasswordInput
              required
              label='Password'
              placeholder='Your password'
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            />

            <Stack spacing={0}>
              {requirements.map((requirement, index) => {
                if (!requirement.meets)
                  return (
                    <PasswordRequirement
                      key={index}
                      label={requirement.label}
                      meets={requirement.meets}
                    />
                  );
              })}
            </Stack>

            <Checkbox
              label='I accept terms and conditions'
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
            />

            <Divider my='xs' />
            <Button disabled={!allowedToLogin} type='submit'>
              Sign up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
