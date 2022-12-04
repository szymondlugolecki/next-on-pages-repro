// Hooks
import { UseFormReturnType } from '@mantine/form';

// Components
import { Alert, Button, Container, Group, Stack, Text } from '@mantine/core';
import { AlertCircle, InfoCircle } from 'tabler-icons-react';
import DependenceCards from '../DependenceCards';
import GameTypeCard from '../GameTypeCard';
import RegionCards from '../RegionCards';

// Types
import type { GameCreationForm, Gamemode, Question } from '../../types/Game';

// Styles

// Client-Side Constants & Functions
import { gameModeCardData, gamemodesSettings } from '../../lib/constants';

import { showError, showSuccess } from '../../lib/functions';
import httpClient from '../../lib/axiosClient';
import { useState } from 'react';

const url = `${process.env.NEXT_PUBLIC_API_URL}/game/create`;

interface GameCreateResponse {
  data: {
    success: true;
    questions: Question[];
    answers: number[];
  };
}

const GameCreator = ({
  gamemode,
  gameForm,
}: {
  gamemode: Gamemode;
  gameForm: UseFormReturnType<GameCreationForm>;
}) => {
  const [ready, setReady] = useState(false);

  const createGameHandler = async () => {
    try {
      const { dependence, gameTypes, regions } = gameForm.values;
      const {
        data: { data },
      } = await httpClient.post<GameCreateResponse>(url, {
        ...{ dependence, gameTypes, regions },
        gamemode,
      });

      const { questions, answers } = data;

      console.log(data);

      gameForm.setValues({
        answers,
        questions,
        gameOn: true,
      });

      showSuccess('Successfully created a game');
    } catch (error) {
      showError('Unexpected error has occured');
    }
  };

  const gmSettings = gamemodesSettings.filter((gm) => gm.name === gamemode)[0];
  if (!gmSettings) return <Text>Unknown error occured</Text>;

  const gameTypeCards = gameModeCardData.map((cardData, index) => (
    <GameTypeCard
      settings={gmSettings.gameTypes}
      cardData={cardData}
      gameForm={gameForm}
      key={index}
    />
  ));

  return (
    <form onSubmit={gameForm.onSubmit(createGameHandler)} onReset={() => gameForm.reset()}>
      <Stack align='center' style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <InfoCircle />
          {/* `👉 ${settings.rules.join('\n👉 ')}` */}
        </div>

        {/* Capital Cities/Flags/Map */}
        <Group spacing='xl'>{gameTypeCards}</Group>

        {/* Regions */}
        <RegionCards gameForm={gameForm} settings={gmSettings.regions} />

        {/* All/Independent/Dependent Countries */}
        <DependenceCards gameForm={gameForm} settings={gmSettings.dependence} />

        {/* Start & Ready Buttons */}
        <Group>
          {gamemode.startsWith('challenge') && (
            <Button color='blue' onClick={() => setReady((prevValue) => !prevValue)}>
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

        {gameForm.values.gameTypes.includes('map') && (
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
};

export default GameCreator;
