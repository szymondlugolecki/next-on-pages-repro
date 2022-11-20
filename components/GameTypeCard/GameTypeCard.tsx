// Hooks
import 'next';

// Components
import { Text, UnstyledButton } from '@mantine/core';

// Types
import { GameTypeCardProps } from '../../types/GameplayTypes';

// Styles
import styles from './GameTypeCard.styles';

// Client-Side Constants & Functions
import { addClasses } from '../../lib/functions';

export function GameTypeCard({
  settings,
  cardData: { title, value, Icon },
  form,
}: GameTypeCardProps) {
  const { classes } = styles();
  const gameTypesSelected = form.values.gameTypes || null;
  const selected = gameTypesSelected && gameTypesSelected.includes(value);

  const handleSelection = () => {
    if (settings.multipleSelection === true) {
      const alreadyExists = gameTypesSelected && gameTypesSelected.indexOf(value) !== -1;

      // if already selected - unselect
      if (alreadyExists) form.removeListItem('gameTypes', gameTypesSelected.indexOf(value));
      // if not selected - select
      else if (!form.values.gameTypes) form.setFieldValue('gameTypes', [value]);
      else form.insertListItem('gameTypes', value);
    } else form.setFieldValue('gameTypes', [value]);
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
}

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
