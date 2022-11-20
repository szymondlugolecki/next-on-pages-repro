// Hooks

// Components
import { Group, Text, UnstyledButton } from '@mantine/core';

// Types
import { RegionsSelectTypes } from '../../types/GameplayTypes';

// Styles
import styles from './RegionCards.styles';

// Client-Side Constants & Functions
import { allRegions } from '../../lib/constants';
import { addClasses, capitalize } from '../../lib/functions';

export function RegionCards({ form, settings }: RegionsSelectTypes) {
  const { classes } = styles();
  const regionButtons = allRegions.map((region, index) => {
    const regionsSelected = form.values.regions || null;
    const selected = regionsSelected && regionsSelected.includes(region);

    const select = () => {
      if (!form.values.regions) form.setFieldValue('regions', [region]);
      else form.insertListItem('regions', region);
    };

    const handleSelection = () => {
      if (settings.mustSelectAll) return;
      const alreadyExists = regionsSelected && regionsSelected.indexOf(region) !== -1;

      // if already selected - unselect
      if (alreadyExists) form.removeListItem('regions', regionsSelected.indexOf(region));
      // if not selected - select
      else select();
    };

    return (
      <UnstyledButton
        key={index}
        onClick={() => handleSelection()}
        className={addClasses(
          classes.item,
          selected ? classes.regionCardSelected : classes.regionCard,
        )}
      >
        <Text weight={500} size='xl'>
          • {capitalize(region)}
        </Text>
      </UnstyledButton>
    );
  });

  return <Group>{regionButtons}</Group>;
}