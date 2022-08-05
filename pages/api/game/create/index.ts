import type { NextApiRequest, NextApiResponse } from 'next';

import redis from '../../../../scripts/redis';

import { PostData, Preference, ResponseData, Question } from '../../../../types/Types';

// 'user:ID': { id: '43434434343', email: 'john@gmail.com', nickname: 'johnny123' }
// 'rel:nickname:NICKNAME': '43434434343'
// 'rel:email:EMAIL': '43434434343'

import QuestionsGenerator from '../../../../exports/QuestionsGenerator';

const generateResponse = (data: PostData): { response: any; message: string } => {
  const { gamemode, preferences, preference, regions, dependence } = data;

  const questionsGenerator = new QuestionsGenerator(
    gamemode,
    regions,
    preferences,
    preference,
    dependence
  );

  // check data
  const valid = questionsGenerator.isValid();
  if (!valid) return { response: null, message: 'Invalid data provided' };

  // retrieve all countries
  questionsGenerator.retrieveCoutries();

  // filter by regions and dependence
  questionsGenerator.filter();

  if (!preference) return { response: null, message: 'No preference provided' };

  const questions = questionsGenerator.generateQuestions();
  const answers = questionsGenerator.correctAIList;
  // console.log(questions);
  if (!questions) return { response: null, message: 'Error while generating response' };
  return { response: questions, message: 'Success' };

  // switch (gamemode) {
  //   case 'learn':
  //     // get all countries based on regions & dependence
  //     // generate answers based on preference
  //     if (!preference) return { response: null, message: 'No preference provided' };

  //     const questions = questionsGenerator.generateQuestions();
  //     console.log(questions)
  //     if (!questions) return { response: null, message: 'Error while generating response' }
  //     return { response: questions, message: 'Success' };
  //     break;
  //   case 'challenge:solo':
  //     if (!preferences) return { response: null, message: 'No preferences provided' };
  //     const { capitalCities, map, flags } = preferences;
  //     // const preferencesList: Preference[] = [
  //     //   capitalCities && 'capitalCities',
  //     //   map && 'map',
  //     //   flags && 'flags',
  //     // ].filter((x) => x);
  //     return { response: null, message: ':)' };
  //   case 'challenge:multiplayer':
  //     return { response: null, message: 'This mode is not available yet!' };
  //     break;
  // }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // validate if it is a POST
    if (req.method !== 'POST') {
      return res.status(200).json({ error: 'This API call only accepts POST methods' });
    }

    console.log(req.body);
    const data: PostData = req.body.data;

    const { response, message } = generateResponse(data);

    console.log('');

    // console.log('CHECK DATA');
    // console.log(capitalCities, map, flags, regions, dependence, gamemode);

    if (!response) return res.status(200).json({ error: message });
    return res.status(200).json({ msg: JSON.stringify({ message, questions: response }) });

    // const questions = questionsHandler(regions, preferences, dependence);
    // console.log('questions', questions.length);
    // if (!questions || questions.length === 0)
    //   return res.status(400).json({ error: 'Error occured. Bad request', msg: '' });

    // @ts-ignore
    res.status(200).json({ msg: 'Game created', error: '', questions });
  } catch (error) {
    console.error(error);
  }
}

/*

TODO:
 * LEARN GAMEMODE:
    > choice: mixed questions | 1 type (all answers [user selects flags: quizes him for all world flags]) |  

*/
