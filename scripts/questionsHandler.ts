import { Countries, CountryName } from 'world-countries';
import { Region, Preference, Dependence } from '../types/Types';

import { CountryClass } from '../exports/CountryClass';

export default (regions: Region[], preferences: Preference[], dependence: Dependence) => {
  const QuizHandler = new CountryClass(regions, preferences, dependence);
  QuizHandler.init();
  console.log(QuizHandler.correctAnswers);
  return QuizHandler.questions;
};
