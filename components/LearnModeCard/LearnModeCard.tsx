// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { Text, Group, Button, Divider, Switch, Chip, Stepper, Card } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';

// Types
import { Region, LearnModeCard, FieldValue } from '../../types/Types';

// Styles
// import styles from './Learn.styles';

// Client-Side Data & Functions
import { regions } from '../../scripts/client';

export function LearnModeCard({
  title,
  description,
  value,
  nextStep,
  setFieldValue,
}: LearnModeCard & { nextStep: () => void; setFieldValue: FieldValue }) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} size="xl" color="yellow">
          {title}
        </Text>
        {/* <Badge color="pink" variant="light">
              On Sale
            </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Button
        variant="light"
        color="yellow"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          nextStep();
          setFieldValue('preference', value);
        }}
      >
        Go
      </Button>
    </Card>
  );
}
