// Hooks
import { useEffect, useState } from 'react';

// Components
import { Button, Container, Divider, Group, Modal } from '@mantine/core';
import Answers from '../Answers';
import { Hint } from '../Hint/Hint';

// Types
import type { GameCreationForm, Gamemode } from '../../types/Game';
import { AfterGameScreen } from '../AfterGameScreen/AfterGameScreen';

// Styles
// import styles from './Quiz.styles';

// Client-Side Constants & Functions
import { gameTypesX, shareAnswersGamemodes } from '../../lib/constants';
import { UseFormReturnType } from '@mantine/form';
// import { axiosInstance } from '../../lib/axiosClient';

const timeout = {
  capitalCities: 720,
  map: 1100,
  flags: 900,
};

const Quiz = ({
  gamemode,
  gameForm,
}: {
  gamemode: Gamemode;
  gameForm: UseFormReturnType<GameCreationForm>;
}) => {
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const [stopModalOpened, setStopModalOpened] = useState(false);
  const currentQuestionIndex = gameForm.values.currentQuestion;

  const nextQuestion = () => {
    console.log('next question', disableButtons);
    gameForm.setFieldValue('currentQuestion', currentQuestionIndex + 1);
    setDisableButtons(false);
  };

  const q = gameForm.values.questions[currentQuestionIndex];

  useEffect(() => {
    // async function fetchCorrectAnswers() {
    //   const { data } = await axiosInstance.get(`/game/answers/16054435`)
    // }
    if (!q && gameForm.values.questions.length === currentQuestionIndex) {
      //
    }
  }, [gameForm.values.currentQuestion, gameForm.values.questions.length, q, currentQuestionIndex]);

  // * Question is undefined and current question index is higher than number of questions
  if (!q && gameForm.values.questions.length === currentQuestionIndex) {
    return <AfterGameScreen gameForm={gameForm} />;
  }

  const gameTypeX = gameTypesX.filter((gt) => gt.name === q.gameType)[0];

  const playerAnswer: number | undefined =
    gameForm.values.playerAnswers[currentQuestionIndex]?.index;
  const correctAI: number = gameForm.values.answers[currentQuestionIndex] ?? -1;
  console.log('correctAI', correctAI);

  const selectAnswer = (answer: number) => {
    setDisableButtons(true);
    // Add Player Answer
    gameForm.insertListItem(
      'playerAnswers',
      { index: answer, time: Date.now() },
      currentQuestionIndex + 1,
    );

    console.log('selectAnswer', 'gamemode', gamemode);

    if (gamemode.startsWith('learn')) {
      // If Learn: Wait a second before moving forward
      setTimeout(() => {
        nextQuestion();
      }, timeout[q.gameType]);
    } else {
      // If Challenge: Move forward right away
      nextQuestion();
    }
  };

  return (
    <Container>
      {/* Reset Modal */}
      <Modal
        opened={stopModalOpened}
        onClose={() => setStopModalOpened(false)}
        title='Are you sure you want to quit?'
        centered
      >
        <Group align='center' position='right'>
          <Button onClick={() => gameForm.reset()}>Yes!</Button>
          <Button onClick={() => setStopModalOpened(false)} color='red'>
            No
          </Button>
        </Group>
      </Modal>

      {/* Hint - a map/flag/country name */}
      <Hint
        gameType={q.gameType}
        hint={q.hint}
        index={gameForm.values.currentQuestion}
        regionData={{ region: q.region, subregion: q.subregion }}
      />

      {/* Divider - contains gameType, current question, number of questions */}
      <Divider
        my='sm'
        variant='dashed'
        label={`${gameTypeX.label} | Question: ${gameForm.values.currentQuestion}/${gameForm.values.questions.length}`}
        labelPosition='center'
      />

      {/* Grid of 4 answers */}
      <Answers
        question={q}
        selectAnswer={selectAnswer}
        correctAI={correctAI}
        disableButtons={disableButtons}
        playerAnswer={playerAnswer}
      />

      {shareAnswersGamemodes.includes(gamemode) && (
        <>
          <Divider my='sm' variant='dashed' />
          <Group position='right'>
            <Button variant='light' color='red' onClick={() => setStopModalOpened(true)}>
              Stop
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
};

export default Quiz;
