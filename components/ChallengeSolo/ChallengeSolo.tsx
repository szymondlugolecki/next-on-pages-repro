// Hooks
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
// import { useState } from 'react';

// Components
import { Text, Group, Button, Divider, Switch, Chip, Stack, Checkbox, Box } from '@mantine/core';
import { Flag, Map, CurrentLocation, Crown, X } from 'tabler-icons-react';
import { RegionsSelect } from '../RegionsSelect/RegionsSelect';
import { DependenceChoice } from '../DependenceChoice/DependenceChoice';

// Types
import { Region, Dependence, Gamemode, GameCreationFormChallenge } from '../../types/Types';

// Styles
import styles from './ChallengeSolo.styles';

// Client-Side Data & Functions
import { regions, postData, dependenceOptions } from '../../scripts/client';
import { showNotification } from '@mantine/notifications';

export function ChallengeSolo({ gamemode }: { gamemode: Gamemode }) {
  const { push, query } = useRouter();
  const { classes } = styles();

  const form = useForm({
    initialValues: {
      dependence: 'all',
      preferences: {
        capitalCities: false,
        map: false,
        flags: false,
      },
      regions: ['europe'],
    } as GameCreationFormChallenge,
    validate: {
      dependence: (dependence: Dependence) =>
        !dependenceOptions.includes(dependence) ? 'Choose between All/Dependent/Independent' : null,
      regions: (arr: Region[]) =>
        arr.every((region) => !regions.includes(region)) ? 'Invalid region provided' : null,
    },
  });

  async function createGame(values: GameCreationFormChallenge) {
    console.log('create Game', gamemode);
    try {
      const { preferences, regions, dependence } = values;
      const data = JSON.stringify({
        data: {
          gamemode,
          preferences,
          regions,
          dependence,
        },
      });
      const response = await postData('/api/game/create', data);
      const { error, msg, questions } = await response.json();

      // unsuccessful
      if (error) return console.error(error);
      console.log('msg', msg); // add a notification

      console.log(questions);
    } catch (error) {
      console.error(error);
    }
  }

  const allQuestionsChecked =
    form.values.preferences.capitalCities &&
    form.values.preferences.flags &&
    form.values.preferences.map;

  return (
    <form onSubmit={form.onSubmit((values) => createGame(values))}>
      <Stack>
        <Text size="lg" weight="bold">
          Questions
        </Text>

        <Checkbox.Group defaultValue={['capitalCities', 'map', 'flags']} required>
          <Checkbox
            onChange={() =>
              form.setFieldValue('capitalCities', !form.values.preferences.capitalCities)
            }
            checked={form.values.preferences.capitalCities}
            className={classes.checkbox}
            size="xl"
            ml={33}
            value="capitalCities"
            label={
              <Group>
                <CurrentLocation size={36} />
                <Text size="xl">Capital Cities</Text>
              </Group>
            }
          />
          <Checkbox
            onChange={() => form.setFieldValue('map', !form.values.preferences.map)}
            checked={form.values.preferences.map}
            className={classes.checkbox}
            size="xl"
            ml={33}
            value="map"
            label={
              <Group>
                <Map size={36} />
                <Text size="xl">Map</Text>
              </Group>
            }
          />
          <Checkbox
            onChange={() => form.setFieldValue('flags', !form.values.preferences.flags)}
            checked={form.values.preferences.flags}
            className={classes.checkbox}
            size="xl"
            ml={33}
            value="flags"
            label={
              <Group>
                <Flag size={36} />
                <Text size="xl">Flags</Text>
              </Group>
            }
          />
        </Checkbox.Group>

        <Divider my="sm" variant="dashed" />

        <Text size="lg" weight="bold">
          Regions
        </Text>

        <RegionsSelect regions={form.values.regions} setFieldValue={form.setFieldValue} />

        <Divider my="sm" variant="dashed" />

        <Text size="lg" weight="bold">
          Advanced
        </Text>

        <Box>
          <DependenceChoice
            dependence={form.values.dependence}
            setFieldValue={form.setFieldValue}
          />
        </Box>

        <Divider my="sm" variant="dashed" />
      </Stack>

      <Group position="apart" mt="xl">
        <Button color="blue" size="lg">
          SAVE
        </Button>
        <Button type="submit" size="lg">
          START
        </Button>
      </Group>
    </form>
  );
}
