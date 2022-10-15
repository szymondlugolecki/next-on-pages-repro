// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useRouter } from 'next/router';

// Components
import { Group, UnstyledButton, Text } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';

// Types
import { Dependence, DependenceChoiceTypes } from '../../types/GameplayTypes';

// Styles
import styles from './DependenceCards.styles';

// Client-Side Constants & Functions
import { dependenceData } from '../../lib/constants';
import { addClasses } from '../../lib/functions';

export function DependenceCards({ form, settings }: DependenceChoiceTypes) {
  const { classes } = styles();
  const dependenceCards = dependenceData.map(({ value, label, Icon }, index) => {
    const dependenceSelected = form.values.dependence || null;
    const selected = dependenceSelected && dependenceSelected === value;

    const handleSelection = () => {
      if (settings.dependence.mustSelectAll && value !== 'all') return;
      form.setFieldValue('dependence', value);
    };

    return (
      <UnstyledButton
        key={index}
        onClick={() => handleSelection()}
        className={addClasses(
          classes.item,
          selected ? classes.dependenceCardSelected : classes.dependenceCard
        )}
      >
        <Icon />
        <Text weight={500} size="xl">
          {label}
        </Text>
      </UnstyledButton>
    );
  });

  return <Group>{dependenceCards}</Group>;
}
