import { showNotification } from '@mantine/notifications';
import { AlertTriangle, Check, InfoCircle, X } from 'tabler-icons-react';

import { allRegions, dependenceList, gameTypesList } from './constants';

import type { Dependence, GameType, Region } from '../types/Game';

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function parseError(error: any) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error) {
    return (error.response.data.message as string) || 'Unexpected error';
  }
  return 'Unknown error';
}

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
