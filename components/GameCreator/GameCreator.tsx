// Hooks
import { UseFormReturnType } from '@mantine/form';
import { useToggle } from '@mantine/hooks';

// Components
import { Alert, Button, Container, Group, Stack, Text } from '@mantine/core';
import { AlertCircle, InfoCircle } from 'tabler-icons-react';
import { DependenceCards } from '../DependenceCards/DependenceCards';
import { GameTypeCard } from '../GameTypeCard/GameTypeCard';
import { RegionCards } from '../RegionCards/RegionCards';

// Types
import type { GameCreationForm, Gamemode, Question } from '../../types/GameplayTypes';

// Styles

// Client-Side Constants & Functions
import { gameModeCardData, gamemodesSettings } from '../../lib/constants';

import { createGame, showError } from '../../lib/functions';

export function GameCreator({
  gamemode,
  form,
  setGameOn,
  setQuestions,
}: {
  gamemode: Gamemode;
  form: UseFormReturnType<GameCreationForm>;
  setGameOn: (on: boolean) => void;
  setQuestions: (questions: Question[]) => void;
}) {
  const [ready, useReady] = useToggle([false, true]);

  const createGameHandler = async (values: GameCreationForm) => {
    const { error, response } = await createGame(values, gamemode);

    if (error) {
      showError(response);
      return console.error(error);
    }

    setQuestions(response);
    setGameOn(true);
  };

  const resetGame = () => {
    setQuestions([]);
    setGameOn(false);
  };

  const gmSettings = gamemodesSettings.find((gm) => gm.name === gamemode);
  if (!gmSettings) return <Text>Unknown error occured</Text>;

  const gameTypeCards = gameModeCardData.map((cardData, index) => (
    <GameTypeCard settings={gmSettings.gameTypes} cardData={cardData} form={form} key={index} />
  ));

  return (
    <form onSubmit={form.onSubmit(createGameHandler)} onReset={resetGame}>
      <Stack align='center' style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <InfoCircle />
          {/* `👉 ${settings.rules.join('\n👉 ')}` */}
        </div>

        {/* Capital Cities/Flags/Map */}
        <Group spacing='xl'>{gameTypeCards}</Group>

        {/* Regions */}
        <RegionCards form={form} settings={gmSettings.regions} />

        {/* All/Independent/Dependent Countries */}
        <DependenceCards form={form} settings={gmSettings.dependence} />

        {/* Start & Ready Buttons */}
        <Group>
          {gamemode.startsWith('challenge') && (
            <Button color='blue' onClick={() => useReady()}>
              Ready
            </Button>
          )}
          <Button
            variant='filled'
            type='submit'
            {...{ disabled: !!(gamemode.startsWith('challenge') && ready === false) }}
          >
            START
          </Button>
        </Group>

        {form.values.gameTypes.includes('map') && (
          <Container size='md'>
            <Alert
              icon={<AlertCircle size={16} />}
              color='blue'
              title='Please note!'
              variant='outline'
            >
              {`Some countries (very small or independent) are not included in the World Map.\n
              This might change in the future. ✌️`}
            </Alert>
          </Container>
        )}
      </Stack>
    </form>
  );
}
