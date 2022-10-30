import { showNotification } from '@mantine/notifications';
import { AlertTriangle, Check, InfoCircle, X } from 'tabler-icons-react';
import type {
  Dependence,
  // GameCreationForm,
  // Gamemode,
  GameType,
  Region,
} from '../types/GameplayTypes';
import { allRegions, dependenceList, gameTypesList } from './constants';

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function parseError(error: any) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error) {
    return (error.response.data.message as string) || 'Unexpected error';
  }
  return 'Unknown error';
}

// : Promise<{ error: true; response: string } | { error: false; response: Question[] }>
export const createGame = () =>
  // gameSettings: GameCreationForm,
  // gamemode: Gamemode
  ({ error: false, response: 'okay' });
// try {
//   // Make the API call
//   const url = `${process.env}/game/create/${gamemode.toLowerCase()}`;
//   const {
//     data: { questions },
//   } = await instance.post<{ questions: Question[] }>(url, gameSettings);

//   return { error: false, response: questions };
// } catch (error: any) {
//   let errorMessage: string = '';
//   if (error && error.error && error.error.message) {
//     errorMessage = error.error.message || '???';
//     console.error('!Error!', errorMessage);
//   } else if (axios.isAxiosError(error)) {
//     errorMessage = error.message;
//     console.error('Error:', errorMessage);
//   } else {
//     console.error('Unexpected error:', error);
//     if (typeof error === 'string') errorMessage = error;
//   }
//   return { error: true, response: errorMessage || 'Unexpected error' };
// }

const compareArrays = (arr1: number[], arr2: number[]): [number | null, number, number] => {
  let correspondingCount = 0;
  if (arr1.length !== arr2.length) return [null, 0, 0];
  arr1.forEach((answer, index) => {
    if (answer === arr2[index]) correspondingCount += 1;
  });

  console.log(correspondingCount, arr1.length);

  const quotient1 = Math.round((correspondingCount / arr1.length) * 100);
  const quotient2 = 100 - quotient1;
  console.log(quotient1, quotient2);
  return [correspondingCount, quotient1, quotient2];
};

const statsToPoints = (
  shortestRT: number,
  averageRT: number,
  longestRT: number,
  correct: number,
  incorrect: number,
): number => {
  let score = 0;
  score += correct;
  score -= incorrect;

  return score;
};

/**
 *
 * @param answersList
 * @param correctAnswers
 * @returns
 */
export const gameDataToStats = (
  answersList: {
    index: number;
    time: number;
  }[],
  correctAnswers: number[],
): {
  title: string;
  stats: string;
  description: string;
}[] => {
  const formatStat = (stat: number | null) => (stat === 0 || stat ? stat : '?');
  const fixNumber = (num: number) => parseFloat(num.toFixed(2));

  // response time
  const responseTimes = answersList.map((answer) => answer.time);
  const highestResponseTime = fixNumber(Math.max(...responseTimes) / 1000);
  const shortestResponseTime = fixNumber(Math.min(...responseTimes) / 1000);
  const averageResponseTime = fixNumber(
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000,
  );

  // correct answers
  const answers = answersList.map((answer) => answer.index);
  const [correctAnswersCount, quotient1, quotient2] = compareArrays(answers, correctAnswers);
  const incorrectAnswersCount =
    correctAnswersCount || correctAnswersCount === 0 ? answers.length - correctAnswersCount : null;

  let score: number | null = null;
  if (correctAnswersCount !== null && incorrectAnswersCount !== null) {
    score = statsToPoints(
      shortestResponseTime,
      averageResponseTime,
      highestResponseTime,
      correctAnswersCount,
      incorrectAnswersCount,
    );
  }

  return [
    {
      title: 'Shortest Response Time',
      stats: `${formatStat(shortestResponseTime)}`,
      description: 'seconds',
    },
    {
      title: 'Average Response Time',
      stats: `${formatStat(averageResponseTime)}`,
      description: 'seconds',
    },

    {
      title: 'Highest Response Time',
      stats: `${formatStat(highestResponseTime)}`,
      description: 'seconds',
    },
    {
      title: 'Correct Answers',
      stats: `${formatStat(correctAnswersCount)}`,
      description: `${formatStat(quotient1)}%`,
    },
    {
      title: 'Incorrect Answers',
      stats: `${formatStat(incorrectAnswersCount)}`,
      description: `${formatStat(quotient2)}%`,
    },
    {
      title: 'Overall Score',
      stats: `${formatStat(score)}`,
      description: 'points',
    },
  ];
};

/** Returns a random number from between 0 and {number}
 * @param {number} number
 */
export const randomNumber = (number: number) => Math.floor(Math.random() * (number + 1));

/**
 * /** Returns a random element from an array provided
 * @param {any[]} arr Array
 */
export const randomElement = <T>(arr: T[]): [T, number] => {
  const rIndex = randomNumber(arr.length - 1);
  return [arr[rIndex], rIndex];
};

export const showError = (error: string) =>
  showNotification({
    title: 'Error',
    message: error,
    autoClose: 3000,
    icon: X({}),
    color: 'red',
  });

export const showSuccess = (message: string) =>
  showNotification({
    title: 'Success',
    message,
    autoClose: 3000,
    icon: Check({}),
  });

export const showInfo = (message: string) =>
  showNotification({
    title: 'Information',
    message,
    autoClose: 3000,
    icon: InfoCircle({}),
    color: 'blue',
  });

export const showWarn = (warning: string) =>
  showNotification({
    title: 'Warning',
    message: warning,
    autoClose: 3000,
    icon: AlertTriangle({}),
    color: 'orange',
  });

export function shuffle<T>(array: T[]): T[] {
  const tempArray = [...array];
  for (let i = tempArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray;
}

export const capitalize = (text: string) =>
  text
    .split(' ')
    .map((word: string) => word.toUpperCase().charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

export const addClasses = (...classes: string[]) =>
  ''.concat(
    ...classes
      .filter((cl) => cl)
      .map((cl) => [...cl, ' '])
      .flat(1),
  );

export const validateGameCreationForm = {
  gameTypes: (gameTypes: GameType[]) => {
    const condition = !!(
      gameTypes &&
      gameTypes.length > 0 &&
      gameTypes.every((gameType: GameType) => gameTypesList.includes(gameType))
    );
    if (condition) return null;
    return 'Invalid Game Type';
  },
  regions: (regions: Region[]) => {
    const condition = !!(
      regions &&
      regions.length > 0 &&
      regions.every((region) => allRegions.includes(region))
    );
    if (condition) return null;
    return 'Invalid Region';
  },
  dependence: (dependence: Dependence) => {
    const condition = !!(dependenceList && dependenceList.includes(dependence));
    if (condition) return null;
    return 'Invalid Dependence options';
  },
};
