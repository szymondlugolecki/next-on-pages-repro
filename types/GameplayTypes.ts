import { UseFormReturnType } from '@mantine/form';
import { Icon } from 'tabler-icons-react';
import { CountryName } from 'world-countries';

export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type APIRequestConfig = 'post-json' | 'get';

export interface GameCreationResponse {
  error: APIError;
  data: Question[];
}

export interface APIError {
  status: number;
  name: string;
  message: string;
  details: Record<string, string>;
}

export interface APIResponseData {
  id: number;
  attributes: Record<string, any>;
  meta: {
    availableLocales?: string[];
  };
}

// Game Creating

export type Gamemode = 'learn' | 'challenge:solo' | 'challenge:multiplayer';
export type Dependence = 'all' | 'independent' | 'dependent';
export type GameType = 'flags' | 'capitalCities' | 'map';
export type Region = 'europe' | 'americas' | 'africa' | 'asia' | 'oceania';

export interface PreferenceSettings {
  mustSelectAll: boolean;
  multipleSelection: boolean;
}

export type GMSetting = Record<Preference, PreferenceSettings>;

export type GameModeSettingNoName = Record<Preference, PreferenceSettings>;

export type GameModeSetting = GameModeSettingNoName & {
  name: Gamemode;
  rules: string[];
};
export type Preference = 'gameTypes' | 'regions' | 'dependence';

export interface GameCreationForm {
  dependence: Dependence;
  regions: Region[];
  gameTypes: GameType[];
}

export interface ShrinkedCountry {
  name: CountryName;
  independent: boolean;
  capital: string;
  region: Region;
  subregion: Subregion;
  flag: string;
  cca2: string;
}

export interface Question {
  gameType: GameType;
  hint: string;
  answers: string[];
  region: Region;
  subregion: Subregion;
  correctAI?: number;
}

export interface PostData {
  gamemode: Gamemode;
  gameTypes: GameType[];
  regions: Region[];
  dependence: Dependence;
}

//

// Store
export type PaymentType = 'onetime' | 'subscription:monthly' | 'subscription:yearly';

export interface Product {
  id: number;
  name: string;
  payment: {
    price: number;
    type: PaymentType;
    stripe: string;
    paypal: string;
    total?: number;
  };
  features: string[];
}

// Request / Response

export interface DataPayload<T> {
  [key: string]: T;
}

export interface DataResponse<T> {
  data?: T;
  isLoading: boolean;
  isError: any;
}

export interface ResponseData {
  error?: string;
  msg?: string;
}

// Components Props

export interface GameTypeCardData {
  title: string;
  value: GameType;
  Icon: Icon;
}

export type GameTypeCardProps = {
  cardData: GameTypeCardData;
  settings: PreferenceSettings;
  form: UseFormReturnType<GameCreationForm>;
};

export interface DependenceChoiceTypes {
  settings: PreferenceSettings;
  form: UseFormReturnType<GameCreationForm>;
}

export interface RegionsSelectTypes {
  settings: PreferenceSettings;
  form: UseFormReturnType<GameCreationForm>;
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

//

// User / Account Creation
export interface Credentials {
  password: string;
  email: string;
}

export interface UserDB {
  id: string;
  username: string;
  email: string;
  password: string;
  created: EpochTimeStamp;
}

export interface RegisterForm {
  email: string;
  password: string;
  terms: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

interface ValidationError<T> {
  message: string;
  path: string | null;
  value: T;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: ValidationError<T>[];
  value: T;
  results: Array<string>;
}

// {
//   'Americas',
//   'Asia',
//   'Africa',
//   'Europe',
//   'Oceania',
//   'Antarctic'
// }

export type Subregion =
  | 'Caribbean'
  | 'Southern Asia'
  | 'Middle Africa'
  | 'Northern Europe'
  | 'Southern Europe'
  | 'Western Asia'
  | 'South America'
  | 'Polynesia'
  | 'Australia and New Zealand'
  | 'Western Europe'
  | 'Eastern Africa'
  | 'Western Africa'
  | 'Eastern Europe'
  | 'Central America'
  | 'North America'
  | 'South-Eastern Asia'
  | 'Southern Africa'
  | 'Eastern Asia'
  | 'Northern Africa'
  | 'Melanesia'
  | 'Micronesia'
  | 'Central Asia'
  | 'Central Europe';
