// Hooks
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useForm, UseFormReturnType } from '@mantine/form';
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
  Container,
  SimpleGrid,
  Modal,
} from '@mantine/core';
import Image from 'next/image';
import { Reset } from '@mantine/form/lib/types';
import { Hint } from '../Hint/Hint';
import { Answers } from '../Answers/Answers';

// Types
import type {
  Region,
  GameType,
  Dependence,
  Gamemode,
  GameCreationForm,
  Question,
} from '../../types/GameplayTypes';
import { AfterGameScreen } from '../AfterGameScreen/AfterGameScreen';
import { gameDataToStats } from '../../lib/functions';

// Styles
import styles from './Quiz.styles';

// Client-Side Constants & Functions
import { gameTypesX, shareAnswersGamemodes } from '../../lib/constants';

const timeout = {
  capitalCities: 720,
  map: 1100,
  flags: 900,
};

export function Quiz({
  gamemode,
  questions,
  answersList,
  addAnswer,
  gameReset,
}: {
  gamemode: Gamemode;
  questions: Question[];
  answersList: {
    index: number;
    time: number;
  }[];
  addAnswer: (answer: { index: number; time: number }) => void;
  gameReset: () => void;
}) {
  const { classes } = styles();
  const [opened, setOpened] = useState(false);
  const { push, query } = useRouter();

  const [question, setQuestion] = useState<number>(0);
  const nextQuestion = () => setQuestion((current) => current + 1);

  const [answerIndex, setAnswerIndex] = useState<number | null>(null);

  const q = questions[question];

  const answerClick = (answer: number, time: number) => {
    // add answer to answersList
    addAnswer({ index: answer, time });
    setAnswerIndex(answer);

    // if learn: wait 2 seconds and forward
    if (gamemode.startsWith('learn')) {
      setTimeout(() => {
        nextQuestion();
        setAnswerIndex(null);
      }, timeout[q.gameType]);
    }

    // if challenge: forward right away
    else if (gamemode.startsWith('challenge')) {
      nextQuestion();
      setAnswerIndex(null);
    }
  };

  // after game - render stats
  if (!q && questions.length === question) {
    const correctAnswers = questions.map((c) => c.correctAI || 1);
    const stats = gameDataToStats(answersList, correctAnswers);
    return <AfterGameScreen data={stats} gameReset={gameReset} />;
  }

  // check if data exists
  if (!q || !q.hint || !q.answers) return <Text>Error</Text>;

  const gameTypeX = gameTypesX.find((gt) => gt.name === q.gameType);

  const resetButton = (
    <>
      <Divider my="sm" variant="dashed" />
      <Group position="right">
        <Button variant="light" color="red" onClick={() => setOpened(true)}>
          Stop
        </Button>
      </Group>
    </>
  );

  return (
    <Container>
      {/* reset modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Are you sure you want to quit?"
        centered
      >
        <Group align="center" position="right">
          <Button onClick={() => gameReset()}>Yes!</Button>
          <Button onClick={() => setOpened(false)} color="red">
            No
          </Button>
        </Group>
      </Modal>
      {/* hint - country name/map/flag */}
      <Hint
        gameType={q.gameType}
        hint={q.hint}
        index={question}
        regionData={{ region: q.region, subregion: q.subregion }}
      />
      {/* divider - gameType, current question, number of questions */}
      <Divider
        my="sm"
        variant="dashed"
        label={`${gameTypeX ? gameTypeX.label : '?'} | Question: ${question}/${questions.length}`}
        labelPosition="center"
      />
      {/* grid of answers */}
      <Answers
        answers={q.answers}
        correctAI={q.correctAI}
        answerIndex={answerIndex}
        answerClick={answerClick}
        setAnswerIndex={setAnswerIndex}
      />
      {shareAnswersGamemodes.includes(gamemode) && resetButton}
    </Container>
  );
}
