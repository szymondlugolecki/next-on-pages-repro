import CountriesData, { Countries, CountryName, Country } from 'world-countries';
import { Region, Preference, Question, Dependence } from '../types/Types';

import { capitalize } from '../scripts/client';

const x = [
  {
    type: 'flags',
    hint: 'https://flagcdn.com/w20/pl.png',
    answers: ['Poland', 'Germany', 'Switzerland', 'Hungary'],
    correctAI: 0,
  },
  {
    type: 'capital',
    hint: 'Poland',
    answers: ['Paris', 'Berlin', 'Warsaw', 'Helsinki'],
    correctAI: 2,
  },
  {
    type: 'country',
    hint: 'Warsaw',
    answers: ['Belarus', 'Portugal', 'Egypt', 'Poland'],
    correctAI: 3,
  },
  {
    type: 'map',
    hint: { country: 'pl', value: null },
    answers: ['Poland'],
    correctAI: 0,
  },
];

interface CountryDataSend {
  name: CountryName;
  capital: string[];
  region: string;
  subregion: string;
  borders: Array<string>;
  independent: boolean;
}

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

export class CountryClass {
  private limit = 30;
  public countries;
  public preferences;
  public regions;
  public dependence;
  public questions!: Question[];
  public correctAnswers!: number[];
  constructor(regions: Region[], preferences: Array<Preference>, dependence: Dependence) {
    this.regions = regions;
    this.preferences = preferences;
    this.countries = CountriesData;
    this.dependence = dependence;
  }

  // returns 30 questions
  init() {
    // countries but limited to selected regions & count limit
    this.questions = [];
    this.correctAnswers = [];
    if (!this.regions || this.regions.length === 0) return;
    const shuffledCountries = this.shuffle(this.countries);
    const randomCountries = shuffledCountries
      .filter((country) => this.regions.includes(country.region.toLowerCase()))
      .filter((country) => {
        if (this.dependence) return country.independent === true;
        else return true;
      })
      .slice(0, this.limit);

    console.log('randomCountries', randomCountries.length);

    randomCountries.forEach((country, index) => {
      const randomPreference = this.preferences[this.randomNumber(this.preferences.length)];
      const [question, correctAI] = this.countryToQuestion(country, randomPreference);
      this.questions.push(question);
      this.correctAnswers.push(correctAI);
    });
  }

  private countryToQuestion(
    { name, capital, region, subregion, borders, independent }: Country & { region: Region },
    preference: Preference
  ): [Question, number] {
    let question;
    const { common } = name;
    const capitalText = capital.join(' / ');
    let answers = [];
    let correctAI = -1;
    if (preference === 'capitalCities') {
      answers = this.shuffle([capitalText, ...this.threeFakeAnswers(region, name, preference)]);
      correctAI = answers.indexOf(capitalText);
    } else {
      answers = this.shuffle([common, ...this.threeFakeAnswers(region, name, preference)]);
      correctAI = answers.indexOf(name.common);
    }
    switch (preference) {
      case 'capitalCities':
        question = { type: preference, hint: common, answers };
        break;
      case 'flags':
        question = { type: preference, hint: common, answers };
        break;
      case 'map':
        question = {
          type: preference,
          hint: { country: common, value: null },
          answers,
        };
        break;
      default:
        question = { type: preference, hint: capitalText, answers };
        break;
    }
    console.log(question, correctAI);
    return [question, correctAI];
  }

  private threeFakeAnswers(
    region: Region,
    { official }: CountryName,
    preference: Preference
  ): string[] {
    // same region but not the same country
    const sameRegionCountries = this.countries.filter(
      (country) => region === country.region && country.name.official !== official
    );
    while (sameRegionCountries.length < 3) {
      sameRegionCountries.push(this.getRandomCountry());
    }
    const threeRandomCountries: Countries = this.shuffle(sameRegionCountries).slice(0, 3);
    if (preference === 'capitalCities')
      return threeRandomCountries.map((country) => country.capital.join(' / '));
    else return threeRandomCountries.map((country) => country.name.common);
  }

  private getRandomCountry() {
    return this.countries[this.randomNumber(this.countries.length)];
  }

  public showRegions() {
    console.log(new Set(this.countries.map((country) => country.region)));
  }

  public shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  public coutryNames() {
    return CountriesData.map((country) => country.name);
  }

  public randomNumber = (number: number) => Math.floor(Math.random() * number);
}

// make sure questions do not repeat themselves
// make sure each answer is unique
// make sure there's 30 questions when the preferences are limited
// sometimes there's 3 answers only (or less maybe)
