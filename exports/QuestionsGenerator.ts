import CountriesData, { Countries, CountryName, Country } from 'world-countries';
import {
  Region,
  Preference,
  Question,
  Dependence,
  Preferences,
  Gamemode,
  ShrinkedCountry,
  AnswersObject,
} from '../types/Types';

import {
  capitalize,
  challengeQuestionLimit,
  gamemodes,
  regions as RegionsList,
  shuffle,
  preferencesList,
  dependenceOptions,
  availableGamemodes,
} from '../scripts/client';

/*
  if gamemode === learn
    get all countries filtered by region and dependence
    generate answers
    return
  if gamemode === challenge:solo
    get all countries filtered by region and dependence
    limit them
    generate answers
    return
*/

export default class QuestionsGenerator {
  private limit = challengeQuestionLimit;
  private countries!: ShrinkedCountry[];
  private gamemode: Gamemode;
  private preferences?: Preferences;
  private preference?: Preference;
  private regions: Region[];
  private dependence: Dependence;
  public correctAIList!: number[];
  public questions: any;
  constructor(
    gamemode: Gamemode,
    regions: Region[],
    preferences: Preferences | undefined,
    preference: Preference | undefined,
    dependence: Dependence
  ) {
    this.gamemode = gamemode;
    this.regions = regions;
    this.preferences = preferences;
    this.preference = preference;
    this.dependence = dependence;
  }

  /** Generates 4 answers (3 fake, 1 correct), all from the same region
   * @param {ShrinkedCountry} country
   * @param {Preference} preference
   */
  private generateAnswers(
    country: ShrinkedCountry,
    preference: Preference
  ): { correctAI: number; answers: string[] } {
    const fakeAnswers = this.countries
      // same region
      .filter((fakeCountry) => fakeCountry.region === country.region)
      // different than the correct answer
      .filter((fakeCountry) => fakeCountry.name.official !== country.name.official)
      // limit to 3
      .slice(0, 3);

    const result: AnswersObject = {
      correctAI: 0,
      answers: [],
    };

    let correctAnswerText = '';

    if (preference === 'capitalCities') {
      fakeAnswers.forEach(({ capital }) => {
        result.answers.push(capital);
      });
      result.answers.push(country.capital);
      correctAnswerText = country.capital;
    } else {
      fakeAnswers.forEach(({ name: { official } }) => {
        result.answers.push(official);
      });
      result.answers.push(country.name.official);
      correctAnswerText = country.name.official;
    }

    result.answers = shuffle(result.answers);
    result.correctAI = result.answers.indexOf(correctAnswerText);

    return result;
  }

  /** Generates and returns questions from given country dataset
   * @param {ShrinkedCountry[]} countriesList
   * @param {Preference[]} preferenceList
   */
  private countriesToQuestions(countriesList: ShrinkedCountry[], preferenceList: Preference[]) {
    return countriesList.map((country): Question | undefined => {
      // hint for 'capitalCities' is {country.name}
      // hint for 'map' is {undefined}
      // hint for 'flags' is {country.flag}

      const { name, flag } = country;

      const response: Question = {
        type:
          preferenceList.length === 1 ? preferenceList[0] : this.randomPreference(preferenceList),
      };

      if (response.type === 'capitalCities') response.hint = name.official;
      else if (response.type === 'flags') response.hint = flag;
      else response.hint = { country: country.cca2, value: ':O' };

      if (!response.type) return;
      const { answers, correctAI } = this.generateAnswers(country, response.type);
      response.answers = answers;
      // response.correctAI = correctAI;

      this.correctAIList.push(correctAI);

      return response;
    });
  }

  public generateQuestions() {
    const preferenceList: Preference[] | null = this.preferencesList();
    if (!preferenceList || preferenceList.length === 0) return null;
    if (this.gamemode.startsWith('learn')) {
      const countriesList = shuffle(this.countries);
      return this.countriesToQuestions(countriesList, preferenceList);
    } else if (this.gamemode.startsWith('challenge')) {
      const countriesList = shuffle(this.getCountries(this.limit));
      return this.countriesToQuestions(countriesList, preferenceList);
    } else return null;
  }

  /** Returns a random preference out of provided
   * @param {Preference[]} preferences List of preferences
   */
  private randomPreference(preferences: Preference[]): Preference {
    return preferences[this.randomNumber(preferences.length)];
  }

  /** Assigns countries data to {this.countries} & removes unnecessary data & turn {capital} variable into a string */
  public retrieveCoutries() {
    this.countries = CountriesData.map(({ name, independent, capital, region, flag, cca2 }) => ({
      name,
      independent,
      capital: capital.join(' / '),
      region: region.toLowerCase() as Region,
      flag,
      cca2,
    }));
  }

  /** Check if provided data is valid */
  public isValid() {
    const preferencesAllKeysExist =
      this.preferences &&
      // @ts-ignore
      Object.keys(this.preferences).every((pref) => preferencesList.includes(pref));
    const preferencesValid = this.gamemode.startsWith('challenge')
      ? this.preferences
        ? Object.values(this.preferences).some((x) => x) && preferencesAllKeysExist
        : false
      : true;
    const preferenceValid = this.gamemode.startsWith('learn')
      ? this.preference
        ? preferencesList.includes(this.preference)
        : false
      : true;

    return (
      availableGamemodes.includes(this.gamemode) &&
      this.regions.every((region) => RegionsList.includes(region)) &&
      preferencesValid &&
      preferenceValid &&
      dependenceOptions.includes(this.dependence)
    );
  }

  /** Filters countries by dependence and region */
  public filter() {
    this.countries = this.countries.filter(this.filterByDependence).filter(this.filterByRegion);
  }

  /** Returns an array of random countries limited by the {limit} argument
   * @param {number} limit number of countries it should return
   */
  private getCountries(limit: number): ShrinkedCountry[] {
    return this.countries.slice(0, limit);
  }

  /** Returns all preferences in an array */
  private preferencesList() {
    if (this.gamemode.startsWith('learn') && this.preference) return [this.preference];
    else if (this.gamemode.startsWith('challenge')) {
      const prefList: Preference[] = [];
      if (!this.preferences) return null;
      for (const [key, value] of Object.entries(this.preferences)) {
        if (value === true) prefList.push(key as Preference);
      }
      return prefList;
    } else return null;
  }

  /** Returns a randomly selected country */
  private getRandomCountry() {
    return this.countries[this.randomNumber(this.countries.length)];
  }

  /** Returns all existing regions */
  public showRegions() {
    return new Set(this.countries.map((country) => country.region));
  }

  /** Returns names of all countries */
  public countryNames() {
    return CountriesData.map((country) => country.name);
  }

  /** Returns a random number from between 0 and {number}
   * @param {number} number
   */
  public randomNumber = (number: number) => Math.floor(Math.random() * number);

  private filterByRegion = ({ region }: ShrinkedCountry) => {
    return this.regions.includes(region);
  };

  private filterByDependence = ({ independent }: ShrinkedCountry) => {
    // by dependence
    if (this.dependence === 'all') return true;
    else if (this.dependence === 'dependentOnly' && independent === false) return true;
    else if (this.dependence === 'independentOnly' && independent === true) return true;
    else return false;
  };
}

// make sure questions do not repeat themselves
// make sure each answer is unique
// make sure there's 30 questions when the preferences are limited
// sometimes there's 3 answers only (or less maybe)
