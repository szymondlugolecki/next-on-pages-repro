// Hooks

// Components
import { Group, Text, UnstyledButton } from '@mantine/core';

// Types
import { DependenceChoiceTypes } from '../../types/Game';

// Styles
import styles from './DependenceCards.styles';

// Client-Side Constants & Functions
import { dependenceData } from '../../lib/constants';
import { addClasses } from '../../lib/functions';

const DependenceCards = ({ gameForm, settings }: DependenceChoiceTypes) => {
  const { classes } = styles();
  const dependenceCards = dependenceData.map(({ value, label, Icon }, index) => {
    const dependenceSelected = gameForm.values.dependence || null;
    const selected = dependenceSelected && dependenceSelected === value;

    const handleSelection = () => {
      if (settings.mustSelectAll && value !== 'all') return;
      gameForm.setFieldValue('dependence', value);
    };

    return (
      <UnstyledButton
        key={index}
        onClick={() => handleSelection()}
        className={addClasses(
          classes.item,
          selected ? classes.dependenceCardSelected : classes.dependenceCard,
        )}
      >
        <Icon />
        <Text weight={500} size='xl'>
          {label}
        </Text>
      </UnstyledButton>
    );
  });

  return <Group>{dependenceCards}</Group>;
};

export default DependenceCards;
