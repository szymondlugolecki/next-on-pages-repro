// Hooks

// Components
import { SimpleGrid } from '@mantine/core';
import { Question } from '../../types/Game';
import Answer from '../Answer';

// Types

// Styles

// Client-Side Constants & Functions

const Answers = ({
  question,
  correctAI,
  disableButtons,
  selectAnswer,
  playerAnswer,
}: {
  question: Question;
  correctAI: number;
  disableButtons: boolean;
  selectAnswer: (answer: number) => void;
  playerAnswer: number | undefined;
}) => {
  return (
    <SimpleGrid cols={2}>
      {question.answers.map((answer, index) => (
        <Answer
          text={answer}
          selectAnswer={selectAnswer}
          correctAI={correctAI}
          playerAnswer={playerAnswer}
          disableButtons={disableButtons}
          index={index}
          key={index}
        />
      ))}
    </SimpleGrid>
  );
};

export default Answers;
