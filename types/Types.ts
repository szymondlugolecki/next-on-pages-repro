import { CountryName } from 'world-countries';
import { UseFormReturnType } from '@mantine/form';
import { SetFieldValue } from '@mantine/form/lib/types';
import { ISOCode } from 'react-svg-worldmap';

export interface ResponseData {
  error?: string;
  msg?: string;
}

export interface AnswersObject {
  correctAI: number;
  answers: string[];
}

export interface LearnModeCard {
  title: string;
  description: string;
  value: Preference;
}

interface GameCreationForm {
  dependence: Dependence;
  regions: Region[];
}

export type GameCreationFormLearn = GameCreationForm & {
  preference: Preference;
};

export type GameCreationFormChallenge = GameCreationForm & {
  preferences: Preferences;
};

export interface PostData {
  gamemode: Gamemode;
  preference?: Preference;
  preferences?: Preferences;
  regions: Region[];
  dependence: Dependence;
}
export type FieldValue = SetFieldValue<GameCreationFormLearn | GameCreationFormChallenge>;

export type Gamemode = 'learn' | 'challenge:solo' | 'challenge:multiplayer';
export type Dependence = 'all' | 'independentOnly' | 'dependentOnly';

export interface DependenceChoiceTypes {
  dependence: Dependence;
  setFieldValue: FieldValue;
}

export interface RegionsSelectTypes {
  regions: Region[];
  setFieldValue: FieldValue;
}

export interface ShrinkedCountry {
  name: CountryName;
  independent: boolean;
  capital: string;
  region: Region;
  flag: string;
  cca2: ISOCode;
}

export type Preference = 'flags' | 'capitalCities' | 'map';
export type Preferences = {
  capitalCities: boolean;
  map: boolean;
  flags: boolean;
};
export interface Question {
  type?: Preference; // 'flags' | 'capitalCities' | 'map'
  hint?: string | { country: string; value: any }; // user answers based on this
  answers?: string[]; // all answers (1 correct, 3 wrong)
  correctAI?: number;
}

export type Region = 'europe' | 'americas' | 'africa' | 'asia' | 'oceania';

// {
//   'Americas',
//   'Asia',
//   'Africa',
//   'Europe',
//   'Oceania',
//   'Antarctic'
// }

export interface Credentials {
  password: string;
  email: string;
}

export interface UserDB {
  id: string;
  nickname: string;
  email: string;
  password: string;
  created: EpochTimeStamp;
}

export interface FormValues {
  email: string;
  nickname: string;
  password: string;
  terms: boolean;
}

export interface StatsProps {
  data: {
    label: string;
    stats: string;
    progress: number;
    color: string;
    icon: 'up' | 'down';
  }[];
}
