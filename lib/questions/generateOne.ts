import { shuffle } from '../edgeFunctions';
import type { GameType, Question, ShrinkedCountry } from '../../types/Game';

// gameType: GameType;
// hint: string;
// answers: string[];
// region: Region;
// subregion: Subregion;
// correctAI?: number;

const generateOne = (
  gameType: GameType,
  country: ShrinkedCountry,
  fakeCountries: ShrinkedCountry[],
): [Question, number] => {
  const question = {
    gameType,
  } as Question;

  // Region & Subregion
  question.region = country.region;
  question.subregion = country.subregion;

  let correctAI: number = -1;

  // Hint
  if (['map', 'flags'].includes(gameType)) {
    // If flags/map: CCA2
    question.hint = country.cca2;
    const fakeAnswers = fakeCountries.map(({ name }) => name.common);
    question.answers = shuffle([country.name.common, ...fakeAnswers]);
    correctAI = question.answers.indexOf(country.name.common);
  } else {
    // If capitalCities: Country Name
    question.hint = country.name.common;
    const fakeAnswers = fakeCountries.map(({ capital }) => capital);
    question.answers = shuffle([country.capital, ...fakeAnswers]);
    correctAI = question.answers.indexOf(country.capital);
  }

  return [question, correctAI];
};

export default generateOne;
