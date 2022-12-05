import type { NextRequest } from 'next/server';

import { Dependence, Gamemode, GameType, Region } from '../../../types/Game';

import {
  allRegions,
  availableGamemodes,
  dependenceList,
  gamemodes,
  gameTypesList,
} from '../../../lib/constants';
import generateQuestions from '../../../lib/questions/generate';
import { sendError, sendSuccess } from '../../../lib/edgeFunctions';
import type { GameCreateBody } from '../../../types/Game';

const isValid = (
  gamemode: Gamemode,
  gameTypes: GameType[],
  regions: Region[],
  dependence: Dependence,
): { message?: string; valid: boolean } => {
  // * Basic
  if (!gamemode || !regions || !dependence)
    return {
      message: 'Missing data',
      valid: false,
    };

  // * Gamemode
  if (!gamemodes.includes(gamemode))
    return {
      message: 'Invalid gamemode',
      valid: false,
    };
  if (!availableGamemodes.includes(gamemode))
    return {
      message: 'This gamemode is not available yet',
      valid: false,
    };

  // * GameTypes
  if (!gameTypes.every((gameType) => gameTypesList.includes(gameType)))
    return {
      message: 'Invalid gameTypes provided',
      valid: false,
    };

  if (!regions.every((region) => allRegions.includes(region)))
    // * Regions
    return {
      message: 'Invalid region',
      valid: false,
    };

  // * Dependence
  if (!dependenceList.includes(dependence))
    return {
      message: 'Invalid dependence data',
      valid: false,
    };

  return {
    valid: true,
  };
};

const gameCreate = async (req: NextRequest) => {
  // Continue only if its a POST request
  if (req.method !== 'POST') return sendError({ message: 'Only POST method is allowed' });

  try {
    const data: GameCreateBody = await req.json();
    const { gamemode, gameTypes, regions, dependence } = data;

    // Check if data was provided
    if (!gamemode || !gameTypes || !regions || !dependence)
      return sendError({ message: 'Data is missing' });

    // Basic data validation
    const { valid, message } = isValid(gamemode, gameTypes, regions, dependence);
    if (!valid) return sendError({ message });

    // Generate questions
    const { questions, answers, privateGame } = generateQuestions(
      gamemode,
      gameTypes,
      regions,
      dependence,
    );

    // Check if questions were successfully generated
    if (!questions) {
      return sendError({ message: "Unexpected error. Couldn't generate questions" });
    }

    // * Here the game can be added to a Durable Object for multiplayer support
    // * And added to the DB to store user stats etc. (single and multi)

    return sendSuccess({ data: { questions, answers: privateGame ? [] : answers } });
  } catch (error) {
    console.error(error);
    return sendError({ message: 'Unexpected error. Request was possibly invalid' });
  }
};

export default gameCreate;

export const config = {
  runtime: 'experimental-edge',
};