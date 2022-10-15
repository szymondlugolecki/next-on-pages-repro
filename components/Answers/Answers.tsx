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
  UnstyledButton,
} from '@mantine/core';
import { Answer } from '../Answer/Answer';

// Types
import type {
  Region,
  GameType,
  Dependence,
  Gamemode,
  GameCreationForm,
  Question,
} from '../../types/GameplayTypes';

// Styles

// Client-Side Constants & Functions

export function Answers({
  answers,
  correctAI,
  answerIndex,
  answerClick,
  setAnswerIndex,
}: {
  answers: string[];
  correctAI?: number;
  answerIndex: number | null;
  answerClick: (answer: number, time: number) => void;
  setAnswerIndex: (answered: number | null) => void;
}) {
  const start = Date.now();

  const clickFunc = (index: number) => {
    setAnswerIndex(index);
    answerClick(index, Date.now() - start);
  };

  return (
    <SimpleGrid cols={2}>
      {answers.map((answer, index) => (
        <Answer
          text={answer}
          index={index}
          answerIndex={answerIndex}
          correctAI={correctAI}
          clickFunc={clickFunc}
          key={index}
        />
      ))}
    </SimpleGrid>
  );
}
