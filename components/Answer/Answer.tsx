// Hooks

// Components
import { Text, Button } from '@mantine/core';

// Types

// Styles

// Client-Side Constants & Functions

export function Answer({
  text,
  index,
  answerIndex,
  correctAI,
  clickFunc,
}: {
  text: string;
  index: number;
  answerIndex: number | null;
  correctAI: number | undefined;
  clickFunc: (index: number) => void;
}) {
  let color: string = 'dark';

  // only bother if correctAI exists (learn gamemode)
  if (correctAI !== undefined) {
    // if answered anything & this is the correct answer, then color = green
    if (answerIndex !== null && correctAI === index) color = 'green';
    // if checked this, but its a wrong answer, then color = red
    else if (index === answerIndex && correctAI !== answerIndex) color = 'red';
  }

  return (
    <Button
      onClick={() => {
        if (!answerIndex) clickFunc(index);
      }}
      px="md"
      size="lg"
      color={color}
    >
      <Text size="lg" weight={600}>
        {text}
      </Text>
    </Button>
  );
}
