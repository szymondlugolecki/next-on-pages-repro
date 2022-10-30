import CountriesData from 'world-countries';
import {
  Dependence,
  Gamemode,
  GameType,
  Question,
  Region,
  ShrinkedCountry,
  Subregion,
} from '../types/GameplayTypes';

import {
  allRegions,
  availableGamemodes,
  challengeQuestionLimit,
  gameTypesList,
  shareAnswersGamemodes,
} from './constants';

import { randomElement, shuffle } from './functions';

import countriesWithTopology from '../public/countriesWithTopology.json';

const gameTypeFilter = (gameType: GameType, country: ShrinkedCountry) => {
  if (gameType === 'capitalCities' && country.capital) return true;
  if (gameType === 'flags' && country.flag) return true;
  if (gameType === 'map' && country.cca2) return true;
};

const countryData = CountriesData.map(
  ({ name, independent, capital, region, subregion, flag, cca2 }) => ({
    name,
    independent,
    capital: capital.join(' / '),
    region: region.toLowerCase() as Region,
    subregion: subregion as Subregion,
    flag,
    cca2,
  }),
);

export default class QuestionsGenerator {
  private limit: number | null = null;

  private gamemode: Gamemode;

  private gameTypes: GameType[];

  private regions: Region[];

  private dependence: Dependence;

  private countries: ShrinkedCountry[];

  private mappableCountries!: ShrinkedCountry[];

  private correctAIList: number[] = [];

  public questions: Question[] = [];

  constructor(
    gamemode: Gamemode,
    regions: Region[],
    gameTypes: GameType[],
    dependence: Dependence,
  ) {
    this.gamemode = gamemode;
    this.regions = regions;
    this.gameTypes = gameTypes;
    this.dependence = dependence;

    this.countries = countryData;

    if (this.gamemode.startsWith('challenge')) this.limit = challengeQuestionLimit;
  }

  /**
   * Returns answers list
   * @returns {number[]} list of indexes
   */
  public getAnswers(): number[] {
    return this.correctAIList;
  }

  /**
   * Generates 3 countries to use as fake answers
   * @param country
   * @param gameType
   * @returns
   */
  private getIncorrectAnswers(country: ShrinkedCountry, gameType: GameType): ShrinkedCountry[] {
    const countryName = country.name.common;

    const bySubregion = (c: ShrinkedCountry) =>
      c.subregion === country.subregion && c.name.common !== countryName;
    const byRegion = (c: ShrinkedCountry) =>
      c.region === country.region && c.name.common !== countryName;

    // Shuffle countries
    // To get 3 incorrect answers (different than the correct one)
    let incorrectCountries = shuffle(this.countries);

    // Preferably the same subregion
    // If too few countries, choose region instead (Slovakia - Central Europe[1])
    if (incorrectCountries.filter(bySubregion).length < 3) {
      incorrectCountries = incorrectCountries.filter(byRegion);
    } else incorrectCountries = incorrectCountries.filter(bySubregion);

    // Filter occurences that dont have a capital city/flag
    incorrectCountries = incorrectCountries.filter((c) => gameTypeFilter(gameType, c));

    // Prevent memory leaks (just in case)
    let numberOfLoops = 0;

    // If lacking incorrect answers
    // Add until there's 3
    while (incorrectCountries.length < 3 && numberOfLoops < 15) {
      const [randomCountry]: [ShrinkedCountry, any] = randomElement(this.countries);
      if (
        incorrectCountries.length === 0 ||
        !incorrectCountries.map((ic) => ic.name.common).includes(randomCountry.name.common)
      ) {
        // console.log('Adding Random Country', randomCountry.name.common);
        incorrectCountries.push(randomCountry);
      }
      numberOfLoops++;
    }

    return incorrectCountries.slice(0, 3);
  }

  /** Generates and returns 4 answers (1 correct, 3 incorrect) from the same region
   * @param {ShrinkedCountry} country
   * @param {GameType} gameType
   */
  private generateQuestion = (country: ShrinkedCountry, gameType: GameType): [Question, number] => {
    const countryName = country.name.common;

    const incorrectAnswers = this.getIncorrectAnswers(country, gameType);

    let correctAnswerText: string = '';
    let hint: string = '';
    let answers: string[] = [];

    // Generating answers
    // Hint is based on what you answer a question
    // Example:
    // GameMode: capitalCities; Hint: Poland; Answers: Warsaw, Helsinki, Moscow, Praha
    if (gameType === 'capitalCities') {
      correctAnswerText = country.capital;
      incorrectAnswers.forEach(({ capital }) => answers.push(capital));
      answers.push(country.capital);
      hint = countryName;
    } else {
      correctAnswerText = countryName;
      incorrectAnswers.forEach(({ name: { common } }) => answers.push(common));
      answers.push(countryName);
      hint = country.cca2;
    }

    // Shuffle the answers
    answers = shuffle(answers);

    // Index of the correct answer
    const correctAI = answers.indexOf(correctAnswerText);

    // Boolean - is the correct answer public
    const publicCorrectAnswer = shareAnswersGamemodes.includes(this.gamemode);

    // Region
    const response: Question = {
      answers,
      region: country.region,
      subregion: country.subregion,
      gameType,
      hint,
      correctAI: publicCorrectAnswer ? correctAI : undefined,
    };

    if (answers.find((a) => !a)) console.log('WARNING', 'answers', answers, country.name.common);

    return [response, correctAI];
  };

  /** Generates and returns game questions
   */
  public generateQuestions = (): Question[] => {
    // @ts-ignore
    const gTCountries: Record<
      GameType,
      {
        countries: ShrinkedCountry[];
        randomCountry: () => ShrinkedCountry | null;
      }
    > = {};

    this.gameTypes.forEach((gameType) => {
      let cs = gameType === 'map' ? [...this.mappableCountries] : [...this.countries];
      cs = cs.filter((c) => gameTypeFilter(gameType, c));
      gTCountries[gameType] = {
        countries: shuffle(cs),
        randomCountry() {
          const [c, cIndex] = randomElement(this.countries);
          this.countries.splice(cIndex, 1);
          return c;
        },
      };
    });

    // !!!

    // mappableCount never actually used
    const onlyGameType = this.gameTypes.length === 1 ? this.gameTypes[0] : null;
    const mappableCount = this.gameTypes.includes('map')
      ? this.mappableCountries.length
      : this.countries.length;

    const noLimitQCount = onlyGameType ? gTCountries[onlyGameType].countries.length : mappableCount;
    const maxQuestions = this.limit || noLimitQCount;

    // !!!

    // GameType Index
    let gameTypeIndex = 0;
    const handleGTIndex = () => {
      if (gameTypeIndex === this.gameTypes.length - 1) gameTypeIndex = 0;
      else gameTypeIndex++;
    };

    const gameType = () => this.gameTypes[gameTypeIndex];
    const countryHandler = () => {
      const gtCountry = gTCountries[gameType()];
      let country: ShrinkedCountry | null = gtCountry.randomCountry();
      if (country) return country;
      let i = 0;

      while (country === null && i < this.gameTypes.length) {
        gameTypeIndex++;
        country = gtCountry.randomCountry();
        i++;
      }

      if (country === null) {
        if (gameType() === 'map') [country] = randomElement(this.mappableCountries);
        else [country] = randomElement(this.countries);
      }

      return country;
    };

    // Each loop = One question
    for (let q = 0; q < maxQuestions; q++) {
      const country: ShrinkedCountry = countryHandler();

      // Turning country into a question
      const [question, correctAI] = this.generateQuestion(country, gameType());

      this.questions.push(question);
      this.correctAIList.push(correctAI);

      // Handle gameType Index
      handleGTIndex();
    }

    return this.questions;
  };

  /** Filters country data by region and dependence */
  public init() {
    const filterByRegion = ({ region }: ShrinkedCountry) => this.regions.includes(region);
    const filterByDependence = ({ independent }: ShrinkedCountry) => {
      if (this.dependence === 'all') return true;
      if (this.dependence === 'dependent' && independent === false) return true;
      if (this.dependence === 'independent' && independent === true) return true;
    };

    this.countries = this.countries.filter(filterByRegion).filter(filterByDependence);
    this.mappableCountries = this.countries.filter(({ cca2 }) =>
      countriesWithTopology.includes(cca2),
    );

    console.log('Countries:', this.countries.length, 'Mappable:', this.mappableCountries.length);

    if (this.countries.length === 0 || this.mappableCountries.length === 0) return false;
    if (this.limit) {
      if (this.countries.length < this.limit || this.mappableCountries.length < this.limit)
        return false;
    }

    return true;
  }

  /** Check thoroughly, if provided data is valid */
  public isValid() {
    if (!this.gameTypes || this.gameTypes.length === 0) return false;
    if (!this.regions || this.regions.length === 0) return false;
    if (!this.gamemode) return false;

    const checkAll = {
      gamemodesCheck: availableGamemodes.includes(this.gamemode),
      regionsCheck: this.regions.every((region) => allRegions.includes(region)),
      gameTypesCheck: this.gameTypes.every((gameType) => gameTypesList.includes(gameType)),
    };

    const valid = Object.values(checkAll).every((check) => check === true);

    console.log('valid', valid);

    return valid;
  }
}

// make sure questions do not repeat themselves ✔
// make sure each answer is unique ✔
// make sure there's 30 questions when the gameTypes are limited
// sometimes there's 3 answers only (or less maybe)
// ADD: if selected map then cannot select dependentOnly

// some countries dont have capital cities/flags
// so in init() they are filtered out (bad solution, fix in the future)
