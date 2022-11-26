// Hooks

// Components

// Types
import { GameTypeCardProps } from '../../types/Game';

// Styles
import styles from './GameTypeCard.styles';

// Client-Side Constants & Functions
import { addClasses } from '../../lib/functions';
import { UnstyledButton, Text } from '@mantine/core';

export const GameTypeCard = ({
  settings,
  cardData: { title, value, Icon },
  gameForm,
}: GameTypeCardProps) => {
  const { classes } = styles();
  const gameTypesSelected = gameForm.values.gameTypes || null;
  const selected = gameTypesSelected && gameTypesSelected.includes(value);

  const handleSelection = () => {
    if (settings.multipleSelection === true) {
      const alreadyExists = gameTypesSelected && gameTypesSelected.indexOf(value) !== -1;

      // if already selected - unselect
      if (alreadyExists) gameForm.removeListItem('gameTypes', gameTypesSelected.indexOf(value));
      // if not selected - select
      else if (!gameForm.values.gameTypes) gameForm.setFieldValue('gameTypes', [value]);
      else gameForm.insertListItem('gameTypes', value);
    } else gameForm.setFieldValue('gameTypes', [value]);
  };

  return (
    <UnstyledButton
      key={title}
      onClick={() => handleSelection()}
      className={addClasses(
        classes.item,
        selected ? classes.gameTypeCardSelected : classes.gameTypeCard,
      )}
    >
      <Icon />
      <Text weight={500} size='xl'>
        {title}
      </Text>
    </UnstyledButton>
  );
};

/* <Card
shadow="sm"
p="lg"
radius="md"
withBorder
component="button"
onClick={() => form.setFieldValue('gameType', [value])}
style={{ cursor: 'pointer', color: textColor }}
> */

export default GameTypeCard;
