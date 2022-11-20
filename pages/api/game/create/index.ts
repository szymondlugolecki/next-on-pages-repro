import type { NextApiRequest, NextApiResponse } from 'next';

import {
  Dependence, Gamemode,
  Region, ResponseData
} from '../../../../types/GameplayTypes';

import {
  allRegions, availableGamemodes, dependenceList, gamemodes
} from '../../../../lib/constants';
import QuestionsGenerator from '../../../../lib/QuestionsGenerator';

/**
 * Returns null if no errors, returns string if error
 * @param gamemode
 * @param regions
 * @param dependence
 * @returns
 */
const basicValidation = (
  gamemode: Gamemode,
  regions: Region[],
  dependence: Dependence
): string | null => {
  console.log(gamemode, regions, dependence);
  // * general
  if (!gamemode || !regions || !dependence) return 'Missing data';

  // * gamemode
  if (!gamemodes.includes(gamemode)) return 'Invalid gamemode';
  if (!availableGamemodes.includes(gamemode)) return 'This gamemode is not available yet';

  // * regions
  if (!regions.every((region) => allRegions.includes(region))) return 'Invalid region';

  // * dependence
  if (!dependenceList.includes(dependence)) return 'Invalid dependence data';

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const throwError = (error?: string, msg?: string, code?: number) => res.status(code || 400).json({ error, msg });

  const returnResponse = (msg: string, code?: number) => res.status(code || 200).json({ msg });

  try {
    // Validate only if its a POST request
    if (req.method !== 'POST') return throwError('Only POST method allowed');

    // Check if data was provided
    const { data } = req.body;
    if (!data) return throwError('No data was provided');

    // Destructure data
    const { gamemode, gameTypes, regions, dependence } = data;

    // Basic data validation
    const result = basicValidation(gamemode, regions, dependence);
    if (result) return throwError(result);

    // Data valid

    // Generate questions
    const questionsGenerator = new QuestionsGenerator(gamemode, regions, gameTypes, dependence);

    // Thorough data validation
    const valid = questionsGenerator.isValid();
    if (!valid) return throwError('Invalid data provided');

    // Initialize (filter, etc...)
    const success = questionsGenerator.init();

    // Check if initialized (filtered) successfully
    if (!success) {
    {
return throwError(
      "Couldn't retrieve enough countries to start the game. Please select more options",
    );
}

    const questions = questionsGenerator.generateQuestions();
    const answers = questionsGenerator.getAnswers();

    // console.log(questions);
    if (!questions) return throwError('Error while generating questions');

    console.log('git =', answers.length === questions.length);

    const p = questions.map((q) => q.hint);
    console.log(
      'ALL UNIQUE? =',
      p.length === Array.from(new Set(p)).length,
      p.length,
      Array.from(new Set(p)).length
    );

    return returnResponse(JSON.stringify({ questions }));
  } catch (error) {
    console.error(error);
  }
}

/*

TODO:
 * LEARN GAMEMODE:
    > choice: mixed questions | 1 type (all answers [user selects flags: quizes him for all world flags]) |
*/
