import {
  Dependence,
  Gamemode,
  GameServerObject,
  GameType,
  Region,
  ShrinkedCountry,
} from '../../../types/Game';
import { challengeQuestionLimit, shareAnswersGamemodes } from '../../constants';
import { getDatasets } from './getDataset';

import { randomElement } from '../../edgeFunctions';
import generateOne from './generateOne';

const generate = (
  gamemode: Gamemode,
  gameTypes: GameType[],
  regions: Region[],
  dependence: Dependence,
) => {
  const datasets = getDatasets(gameTypes, regions, dependence);
  const datasetsCopy = new Map<GameType, ShrinkedCountry[]>(
    JSON.parse(JSON.stringify(Array.from(datasets))),
  );

  const hardLimit: number | null = gamemode.startsWith('challenge') ? challengeQuestionLimit : null;

  const game: GameServerObject = {
    id: crypto.randomUUID(),
    questions: [],
    answers: [],
    privateGame: shareAnswersGamemodes.includes(gamemode) ? false : true,
  };

  const generateRandomQuestion = () => {
    // * Get random gameType from datasets
    const [randomGameType] = randomElement(Array.from(datasets.keys()));

    // * Get random country from the random dataset
    const gameTypeCountries = datasets.get(randomGameType);
    if (!gameTypeCountries) return null;
    const [randomCountry, randomCountryIndex] = randomElement(
      Array.from(gameTypeCountries.values()),
    );

    // * Remove the country from gameType dataset
    gameTypeCountries.splice(randomCountryIndex, 1);
    datasets.set(randomGameType, gameTypeCountries);

    // ? Generate 3 countries for invalid answers

    // * Make a deep copy of datasets Map
    // Countries for invalid answers will be selected from it
    const gameTypeCountriesCopy = datasetsCopy.get(randomGameType);
    if (!gameTypeCountriesCopy) return null;

    // * Turn it into an array & remove the country that is the correct answer
    const gTCountriesCopyArray = Array.from(gameTypeCountriesCopy.values()).filter(
      ({ name }) => name.official !== randomCountry.name.official,
    );

    // * Countries with the same subregion
    const subRegionFilter = gTCountriesCopyArray.filter(
      ({ subregion }) => subregion === randomCountry.subregion,
    );

    // * Countries with the same region
    const regionFilter = gTCountriesCopyArray.filter(
      ({ region }) => region === randomCountry.region,
    );

    // * Select from countries with the same subregion
    // If there's less than 3 countries in the same subregion, choose region

    const gTCountriesCopyArrayFiltered =
      subRegionFilter.length >= 3 ? subRegionFilter : regionFilter;

    // * Get 3 countries for invalid answers
    const [invalidCountry1, invalidCountry1Index] = randomElement(gTCountriesCopyArrayFiltered);
    gTCountriesCopyArrayFiltered.splice(invalidCountry1Index, 1);
    const [invalidCountry2, invalidCountry2Index] = randomElement(gTCountriesCopyArrayFiltered);
    gTCountriesCopyArrayFiltered.splice(invalidCountry2Index, 1);
    const [invalidCountry3, invalidCountry3Index] = randomElement(gTCountriesCopyArrayFiltered);
    gTCountriesCopyArrayFiltered.splice(invalidCountry3Index, 1);

    return generateOne(randomGameType, randomCountry, [
      ...[invalidCountry1, invalidCountry2, invalidCountry3],
    ]);
  };

  let numberOfQuestions = 0;
  for (let gameTypeDataset of datasets.values()) {
    numberOfQuestions += gameTypeDataset.length;
  }

  const limit = hardLimit || numberOfQuestions;

  for (let q = 0; q < limit; q++) {
    const randomQuestion = generateRandomQuestion();
    if (!randomQuestion) return game;
    const [question, answer] = randomQuestion;
    game.questions[q] = question;
    game.answers[q] = answer;
  }

  return game;
};

export default generate;
