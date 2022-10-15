// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import 'next';

// Components
import {
  Text,
  Group,
  Button,
  Divider,
  Switch,
  Chip,
  Stepper,
  Card,
  UnstyledButton,
} from '@mantine/core';
import { InfoCircle, Flag2, Map, CurrentLocation } from 'tabler-icons-react';

// Types
import { Region, GameTypeCardProps } from '../../types/GameplayTypes';

// Styles
import styles from './GameTypeCard.styles';

// Client-Side Constants & Functions
import { gameModeCardData } from '../../lib/constants';
import { addClasses } from '../../lib/functions';

export const GameTypeCard = ({
  settings,
  cardData: { title, value, Icon },
  form,
}: GameTypeCardProps) => {
  const { classes } = styles();
  const gameTypesSelected = form.values.gameTypes || null;
  const selected = gameTypesSelected && gameTypesSelected.includes(value);

  const handleSelection = () => {
    if (settings.multipleSelection === true) {
      const alreadyExists = gameTypesSelected && gameTypesSelected.indexOf(value) !== -1;

      // if already selected - unselect
      if (alreadyExists) form.removeListItem('gameTypes', gameTypesSelected.indexOf(value));
      // if not selected - select
      else {
        if (!form.values.gameTypes) form.setFieldValue('gameTypes', [value]);
        else form.insertListItem('gameTypes', value);
      }
    } else form.setFieldValue('gameTypes', [value]);
  };

  return (
    <UnstyledButton
      key={title}
      onClick={() => handleSelection()}
      className={addClasses(
        classes.item,
        selected ? classes.gameTypeCardSelected : classes.gameTypeCard
      )}
    >
      <Icon />
      <Text weight={500} size="xl">
        {title}
      </Text>
    </UnstyledButton>
  );
};

{
  /* <Card
shadow="sm"
p="lg"
radius="md"
withBorder
component="button"
onClick={() => form.setFieldValue('gameType', [value])}
style={{ cursor: 'pointer', color: textColor }}
> */
}
