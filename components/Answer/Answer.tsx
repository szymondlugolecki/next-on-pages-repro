// Hooks

// Components
import { Text, Button } from '@mantine/core';

// Types

// Styles

// Client-Side Constants & Functions

const Answer = ({
  text,
  index,
  selectAnswer,
  disableButtons,
  correctAI,
  playerAnswer,
}: {
  text: string;
  index: number;
  selectAnswer: (answer: number) => void;
  disableButtons: boolean;
  correctAI: number;
  playerAnswer: number | undefined;
}) => {
  // const [buttonColor, setButtonColor] = useState<'dark' | 'green' | 'red'>('dark');
  let color = 'dark';

  // Only color the buttons if buttons are disabled (user has answered)
  // And if correct answers were provided
  if (disableButtons && correctAI !== -1) {
    // If selected the correct answer, color it green and nothing else
    // If selected a wrong answer, color it red and the correct one green

    if (correctAI === index) color = 'green';
    else if (index === playerAnswer) color = 'red';
  }

  return (
    <Button
      onClick={() => {
        if (!disableButtons) {
          selectAnswer(index);
        }
      }}
      style={{ cursor: disableButtons ? 'default' : 'pointer' }}
      px='md'
      size='lg'
      color={color}
      // disabled={disableButtons}
    >
      <Text size='lg' weight={600}>
        {text}
      </Text>
    </Button>
  );
};

export default Answer;
