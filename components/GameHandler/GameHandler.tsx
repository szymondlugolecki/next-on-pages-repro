// Hooks
import { useState } from 'react';
import { useForm } from '@mantine/form';

// Components
import { Text } from '@mantine/core';
import { GameCreator } from '../GameCreator/GameCreator';
import { Quiz } from '../Quiz/Quiz';

// Types
import type { Question, GameCreationForm, Gamemode } from '../../types/GameplayTypes';

// Styles

// Client-Side Constants & Functions
import { allRegions, gamemodesSettings, gameTypesList } from '../../lib/constants';
import { validateGameCreationForm } from '../../lib/functions';

export function GameHandler({ gamemode }: { gamemode: Gamemode }) {
  const [gameOn, setGameOn] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>();

  const [answersList, setAnswersList] = useState<{ index: number; time: number }[]>([]);
  const addAnswer = (answer: { index: number; time: number }) => setAnswersList((value) => [...value, answer]);

  const settings = gamemodesSettings.find((gm) => gm.name === gamemode);
  if (!settings) return <Text>Unknown error occured</Text>;

  const form = useForm<GameCreationForm>({
    initialValues: {
      gameTypes: settings.gameTypes.mustSelectAll ? gameTypesList : [],
      regions: settings.regions.mustSelectAll ? allRegions : [],
      dependence: 'all',
    },
    validate: validateGameCreationForm,
  });

  const gameReset = () => {
    form.reset();
    setQuestions([]);
    setAnswersList([]);
    setGameOn(false);
  };

  // if game does not exist - render game creator
  if (!gameOn) {
    return (
      <GameCreator
        gamemode={gamemode}
        form={form}
        setGameOn={setGameOn}
        setQuestions={setQuestions}
      />
    );
  }

  // if gameOn & questions exist - render game
  if (questions) {
    return (
      <Quiz
        gamemode={gamemode}
        questions={questions}
        answersList={answersList}
        addAnswer={addAnswer}
        gameReset={gameReset}
      />
    );
  }

  // handle error
  return <Text>Error! No questions found</Text>;
}
