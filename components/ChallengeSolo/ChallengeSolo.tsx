import { useState } from 'react';
import { useForm, useToggle, upperFirst } from '@mantine/hooks';
import { Text, Group, Button, Divider, Switch, Chips, Chip, Tabs } from '@mantine/core';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowBack } from 'tabler-icons-react';

import { Region } from '../../types/Types';

import styles from './ChallengeSolo.styles';

export function ChallengeSolo() {
  const { push, query } = useRouter();
  const { classes } = styles();

  const form = useForm({
    initialValues: {
      countries: false,
      independentOnly: true,
      capitalCities: false,
      map: false,
      flags: false,
      regions: ['europe'] as Region[],
      // mode: 0, // classic | speedrun
    },

    validationRules: {
      regions: (arr: Region[]) =>
        arr.every((region) => ['europe', 'americas', 'africa', 'asia', 'oceania'].includes(region)),
    },
  });

  const createGame = async () => {
    console.log('create Game');
    try {
      const { countries, capitalCities, map, flags, regions, independentOnly } = form.values;
      const data = JSON.stringify({
        countries,
        capitalCities,
        map,
        flags,
        regions,
        independentOnly,
      });
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      const { error, msg, questions } = await response.json();

      // unsuccessful
      if (error) return console.error(error);
      console.log('msg', msg); // add a notification

      console.log(questions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(() => createGame())}>
      <Group direction="column" grow>
        <Text size="xl" weight={700}>
          Quiz
        </Text>

        <Switch
          size="md"
          className={classes.gamemodeSwitch}
          checked={form.values.countries}
          label="Countries"
          onChange={() => form.setFieldValue('countries', !form.values.countries)}
        />
        <Switch
          size="md"
          className={classes.gamemodeSwitch}
          checked={form.values.capitalCities}
          label="Capital Cities"
          onChange={() => form.setFieldValue('capitalCities', !form.values.capitalCities)}
        />
        <Switch
          size="md"
          className={classes.gamemodeSwitch}
          checked={form.values.flags}
          label="Flags"
          onChange={() => form.setFieldValue('flags', !form.values.flags)}
        />
        <Switch
          size="md"
          className={classes.gamemodeSwitch}
          checked={form.values.map}
          label="Map"
          onChange={() => form.setFieldValue('map', !form.values.map)}
        />

        <Divider my="sm" variant="dashed" />

        <Chips
          variant="outline"
          value={form.values.regions}
          defaultValue={form.values.regions}
          position="center"
          size="md"
          multiple
          onChange={(newValue: Region[]) => {
            form.setFieldValue('regions', newValue);
          }}
        >
          <Chip value="europe">Europe</Chip>
          <Chip value="americas">Americas</Chip>
          <Chip value="africa">Africa</Chip>
          <Chip value="asia">Asia</Chip>
          <Chip value="oceania">Oceania</Chip>
        </Chips>
        <Divider my="sm" variant="dashed" />
      </Group>

      <Group position="apart" mt="xl">
        <Button size="lg" color="red" onClick={() => push('/play')}>
          <ArrowBack />
        </Button>
        <Button type="submit" size="lg">
          START
        </Button>
      </Group>
    </form>
  );
}
