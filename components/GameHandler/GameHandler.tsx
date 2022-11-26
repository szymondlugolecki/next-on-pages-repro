// Hooks
import { useForm } from '@mantine/form';

// Components
import { Text } from '@mantine/core';
import GameCreator from '../GameCreator';
import Quiz from '../Quiz';

// Types
import type { GameCreationForm, Gamemode } from '../../types/Game';

// Styles

// Client-Side Constants & Functions
import { allRegions, gamemodesSettings, gameTypesList } from '../../lib/constants';
import { validateGameCreationForm } from '../../lib/functions';

const GameHandler = ({ gamemode }: { gamemode: Gamemode }) => {
  const settings = gamemodesSettings.filter((gm) => gm.name === gamemode)[0];

  const gameForm = useForm<GameCreationForm>({
    initialValues: {
      gameTypes: settings.gameTypes.mustSelectAll ? gameTypesList : [],
      regions: settings.regions.mustSelectAll ? allRegions : [],
      dependence: 'all',
      gameOn: false,
      questions: [],
      playerAnswers: [],
      answers: [],
      currentQuestion: 0,
    },
    validate: validateGameCreationForm,
  });

  // const gameReset = () => {
  //   form.reset();
  //   // form.setValues({
  //   //   gameOn: false,
  //   //   questions: [],
  //   //   playerAnswers: [],
  //   // });
  // };

  // Game Off
  if (!gameForm.values.gameOn) {
    return <GameCreator gamemode={gamemode} gameForm={gameForm} />;
  }

  // Game On & Questions Exist
  if (gameForm.values.questions.length) {
    return <Quiz gamemode={gamemode} gameForm={gameForm} />;
  }

  // Game On but no questions
  return <Text>Error! No questions found</Text>;
};

export default GameHandler;
