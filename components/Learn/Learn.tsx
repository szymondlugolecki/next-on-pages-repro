// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

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
  SegmentedControl,
} from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';
import { LearnModeCard } from '../LearnModeCard/LearnModeCard';
import { RegionsSelect } from '../RegionsSelect/RegionsSelect';
import { DependenceChoice } from '../DependenceChoice/DependenceChoice';

// Types
import { Region, Preference, Dependence, Gamemode, GameCreationFormLearn } from '../../types/Types';

// Styles
import styles from './Learn.styles';

// Client-Side Data & Functions
import {
  regions,
  learnModeCardsData,
  dependenceData,
  postData,
  dependenceOptions,
} from '../../scripts/client';

export function Learn({ gamemode }: { gamemode: Gamemode }) {
  const { push, query } = useRouter();
  const { classes } = styles();

  const [active, setActive] = useState(0);

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // choose one from capital cities / flags / map
  // select number of questions on slider (ewww)
  // region choice
  // dependence choice

  const form = useForm({
    initialValues: {
      dependence: 'all',
      regions: ['europe'],
    } as GameCreationFormLearn,
    validate: {
      dependence: (dependence: Dependence) =>
        !dependenceOptions.includes(dependence) ? 'Choose between All/Dependent/Independent' : null,
      regions: (arr: Region[]) =>
        arr.every((region) => !regions.includes(region)) ? 'Invalid region provided' : null,
    },
  });

  const createGame = async (values: GameCreationFormLearn) => {
    console.log('create Game', gamemode);
    try {
      const { regions, dependence } = values;
      const data = JSON.stringify({
        data: {
          gamemode,
          preference: values.preference,
          regions,
          dependence,
        },
      });
      const response = await postData('/api/game/create', data);
      const { error, msg } = await response.json();

      // unsuccessful
      if (error) return console.error(error);
      const { message, questions } = JSON.parse(msg);
      if (!questions) return console.error('No questions arrived');
      console.log('msg', message); // add a notification

      console.log('questions', questions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
        createGame(values);
      })}
    >
      <Stepper active={active} breakpoint="sm">
        <Stepper.Step label="First step" description="Questions">
          <Group align="center" noWrap={true}>
            {learnModeCardsData.map(({ title, description, value }, index) => (
              <LearnModeCard
                title={title}
                description={description}
                value={value}
                nextStep={nextStep}
                setFieldValue={form.setFieldValue}
                key={index}
              />
            ))}
          </Group>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Regions">
          <RegionsSelect regions={form.values.regions} setFieldValue={form.setFieldValue} />
        </Stepper.Step>
        <Stepper.Step label="Third step" description="Advanced">
          <DependenceChoice
            dependence={form.values.dependence}
            setFieldValue={form.setFieldValue}
          />
        </Stepper.Step>
        <Stepper.Completed>Everything ready. You can now start the game!</Stepper.Completed>
      </Stepper>

      {active !== 0 && (
        <Group position="apart" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          {active === 3 && (
            <Button variant="filled" type="submit">
              START
            </Button>
          )}
          {active !== 3 && (
            <Button variant="filled" onClick={() => nextStep()}>
              Next
            </Button>
          )}
        </Group>
      )}
    </form>
  );
}
