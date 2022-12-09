import { UseFormReturnType } from '@mantine/form';
import { GameCreationForm } from '../../types/Game';

const parseValid = <T>(variable: T) => (variable || variable === 0 ? variable : '?');

// const fixNumber = (num: number) => parseFloat(num.toFixed(2));

const parseTime = (time: number) => {
  const date = new Date(time);
  const timeValue = parseValid(date.toISOString().substring(11, 19));

  if (time >= 1000 * 60 * 60) {
    return [timeValue, 'hours'];
  } else if (time >= 1000 * 60) {
    const timeSplit = timeValue.split(':');
    timeSplit.shift();
    return [timeSplit.join(':'), 'minutes'];
  } else return [(time / 1000).toFixed(2), 'seconds'];
};

const getResponseTimes = ({ gameFormValues }: { gameFormValues: GameCreationForm }) => {
  const responseTimestamps = gameFormValues.playerAnswers.map((answer) => answer.time);
  const responseTimes =
    // responseTimestamps.reduce((previousTs, ts, index) => {
    //   if (index === 1 && gameFormValues.gameStarted) return ts - gameFormValues.gameStarted;
    //   return ts - previousTs;
    // });
    responseTimestamps.map((answer, index) => {
      if (index === 0 && gameFormValues.gameStarted) return answer - gameFormValues.gameStarted;
      return answer - responseTimestamps[index - 1];
    });
  return {
    highest: Math.max(...responseTimes),
    shortest: Math.min(...responseTimes),
    average: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
  };
};

const getPlayerAnswers = (playerAnswers: number[], correctAnswers: number[]) => {
  const matches: boolean[] = [];
  for (let q = 0; q < correctAnswers.length; q++) {
    if (!playerAnswers[q] || !correctAnswers[q]) matches[q] = false;
    else if (playerAnswers[q] === correctAnswers[q]) matches[q] = true;
    else matches[q] = false;
  }

  const numberOfCorrectAnswers = matches.map((answer) => answer === true).length;
  const numberOfIncorrectAnswers = matches.length - numberOfCorrectAnswers;
  // const numberOfIncorrectAnswers = matches.map((answer) => answer === false).length;
  const correctRatio = (numberOfCorrectAnswers / matches.length) * 100;
  const incorrectRatio = 100 - correctRatio;

  return {
    correctAnswersList: matches,
    numberOfIncorrectAnswers,
    correctRatio,
    incorrectRatio,
  };
};

const getUserPoints = ({
  shortest,
  average,
  highest,
  correctRatio,
}: {
  shortest: number;
  average: number;
  highest: number;
  correctRatio: number;
}) => {
  let points = 0;
  // 4 factors
  // max is 100 points

  // shortest - 10% of points
  // 0 ms - 10 points
  // >5 seconds - 0 points
  const shortestPoints = Math.round(10 - shortest / 500);
  points += shortestPoints;

  // average - 30% of points
  // 0 ms - 30 points
  // >5 seconds - 0 points
  const averagePoints = Math.round(30 - average / 166.67);
  points += averagePoints;

  // highest - 10% of points
  // 0 ms - 10 points
  // >10 seconds - 0 points
  const highestPoints = Math.round(10 - highest / 1000);
  points += highestPoints;

  // correctRatio - 50% of points
  // 100% - 50 points
  // 0% - 0 points
  const correctRatioPoints = Math.round(correctRatio / 2);
  points += correctRatioPoints;

  console.table({ shortestPoints, averagePoints, highestPoints, correctRatioPoints });

  return points;
};

export const gameDataToStats = ({
  gameForm,
  correctAnswers,
}: {
  gameForm: UseFormReturnType<GameCreationForm>;
  correctAnswers: number[];
}): {
  name: string;
  value: string;
  description: string;
}[] => {
  // Response Time
  const { average, highest, shortest } = getResponseTimes({ gameFormValues: gameForm.values });

  // Correct Answers
  const { correctAnswersList, numberOfIncorrectAnswers, correctRatio, incorrectRatio } =
    getPlayerAnswers(
      gameForm.values.playerAnswers.map((a) => a.index),
      correctAnswers,
    );

  const points = getUserPoints({ average, shortest, highest, correctRatio });

  return [
    {
      name: 'Shortest Response Time',
      value: `${parseTime(shortest)[0]}`,
      description: parseTime(shortest)[1],
    },
    {
      name: 'Average Response Time',
      value: `${parseTime(average)[0]}`,
      description: parseTime(average)[1],
    },

    {
      name: 'Highest Response Time',
      value: `${parseTime(highest)[0]}`,
      description: parseTime(highest)[1],
    },
    {
      name: 'Correct Answers',
      value: `${parseValid(correctAnswersList.length)}`,
      description: `${parseValid(correctRatio)}%`,
    },
    {
      name: 'Incorrect Answers',
      value: `${parseValid(numberOfIncorrectAnswers)}`,
      description: `${parseValid(incorrectRatio)}%`,
    },
    {
      name: 'Overall Score',
      value: `${parseValid(points)}`,
      description: 'points',
    },
  ];
};
