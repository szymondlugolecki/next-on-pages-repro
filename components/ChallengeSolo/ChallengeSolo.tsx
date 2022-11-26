// Hooks
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
// import { useState } from 'react';

// Components
import { Box, Button, Checkbox, Divider, Group, Stack, Text } from '@mantine/core';
import { CurrentLocation, Flag, Map } from 'tabler-icons-react';
import { DependenceCards } from '../DependenceCards/DependenceCards';
import { RegionCards } from '../RegionCards/RegionCards';

// Types
import type { Dependence, GameCreationForm, Gamemode, GameType, Region } from '../../types/Game';

// Styles
import styles from './ChallengeSolo.styles';

// Client-Side Constants & Functions
import { allRegions, dependenceList, gamemodesSettings } from '../../lib/constants';

export function ChallengeSolo({ gamemode }: { gamemode: Gamemode }) {
  const { push, query } = useRouter();
  const { classes } = styles();

  const form = useForm({
    initialValues: {
      dependence: 'all',
      gameTypes: [],
      regions: ['europe'],
    } as GameCreationForm,
    validate: {
      dependence: (dependence: Dependence) =>
        !dependenceList.includes(dependence) ? 'Choose between All/Dependent/Independent' : null,
      regions: (arr: Region[]) =>
        arr.some((region) => !allRegions.includes(region)) ? 'Invalid region provided' : null,
    },
  });

  async function createGame(values: GameCreationForm) {
    try {
      const { gameTypes, regions, dependence } = values;
      const data = JSON.stringify({
        data: {
          gamemode,
          gameTypes,
          regions,
          dependence,
        },
      });
      const response = await postData('/api/game/create', data);
      const { error, msg } = await response.json();

      // unsuccessful
      if (error) return console.error(error);

      // successful
      const { message, questions } = JSON.parse(msg);
      if (!questions) return console.error('No questions arrived');
      console.log('msg', message); // add a notification

      console.log('questions', questions);
    } catch (error) {
      console.error(error);
    }
  }

  const settings = gamemodesSettings.filter((gm) => gm.name === gamemode)[0];
  if (!settings) return <Text>Unknown error occured</Text>;

  return (
    <form onSubmit={form.onSubmit((values) => createGame(values))}>
      <Stack>
        <Text size='lg' weight='bold'>
          Questions
        </Text>

        <Checkbox.Group
          required
          value={form.values.gameTypes}
          onChange={(value: GameType[]) => form.setFieldValue('gameTypes', value)}
        >
          <Checkbox
            className={classes.checkbox}
            size='xl'
            ml={33}
            label={
              <Group>
                <CurrentLocation size={36} />
                <Text size='xl'>Capital Cities</Text>
              </Group>
            }
            value='capitalCities'
          />
          <Checkbox
            className={classes.checkbox}
            size='xl'
            ml={33}
            label={
              <Group>
                <Map size={36} />
                <Text size='xl'>Map</Text>
              </Group>
            }
            value='map'
          />
          <Checkbox
            className={classes.checkbox}
            size='xl'
            ml={33}
            label={
              <Group>
                <Flag size={36} />
                <Text size='xl'>Flags</Text>
              </Group>
            }
            value='flags'
          />
        </Checkbox.Group>

        <Divider my='sm' variant='dashed' />

        <Text size='lg' weight='bold'>
          Regions
        </Text>

        <RegionCards form={form} settings={settings} />

        <Divider my='sm' variant='dashed' />

        <Text size='lg' weight='bold'>
          Advanced
        </Text>

        <Box>
          <DependenceCards form={form} settings={settings} />
        </Box>

        <Divider my='sm' variant='dashed' />
      </Stack>

      <Group position='apart' mt='xl'>
        <Button color='blue' size='lg'>
          SAVE
        </Button>
        <Button type='submit' size='lg'>
          START
        </Button>
      </Group>
    </form>
  );
}
