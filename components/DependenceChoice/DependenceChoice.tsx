// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { SegmentedControl } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';
import { LearnModeCard } from '../LearnModeCard/LearnModeCard';
import { RegionsSelect } from '../RegionsSelect/RegionsSelect';

// Types
import { Dependence, DependenceChoiceTypes } from '../../types/Types';

// Styles
// import styles from './Learn.styles';

// Client-Side Data & Functions
import { dependenceData } from '../../scripts/client';

export function DependenceChoice({ dependence, setFieldValue }: DependenceChoiceTypes) {
  return (
    <SegmentedControl
      color="green"
      size="md"
      data={dependenceData}
      my="md"
      value={dependence}
      onChange={(e: Dependence) => setFieldValue('dependence', e)}
    />
  );
}
