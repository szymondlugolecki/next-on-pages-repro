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
import { Region, RegionsSelectTypes, Preference } from '../../types/Types';

// Styles
// import styles from './Learn.styles';

// Client-Side Data & Functions
import { regions as allRegions, capitalize } from '../../scripts/client';

export function RegionsSelect({ regions, setFieldValue }: RegionsSelectTypes) {
  return (
    <Chip.Group
      value={regions}
      defaultValue={regions}
      position="left"
      multiple
      onChange={(newValue: Region[]) => setFieldValue('regions', newValue)}
      my="md"
    >
      {allRegions.map((region, index) => (
        <Chip value={region} variant="filled" size="lg" key={index}>
          {capitalize(region)}
        </Chip>
      ))}
    </Chip.Group>
  );
}
