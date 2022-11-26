import { UseFormReturnType } from '@mantine/form';
import { Icon } from 'tabler-icons-react';
import { CountryName } from 'world-countries';

export interface GameCreateBody {
  gamemode: Gamemode;
  gameTypes: GameType[];
  regions: Region[];
  dependence: Dependence;
}

export interface GameServerObject {
  id: string;
  privateGame: boolean;
  questions: Question[];
  answers: number[];
}

export type Gamemode = 'learn' | 'challenge:solo' | 'challenge:multiplayer';
export type Dependence = 'all' | 'independent' | 'dependent';
export type GameType = 'flags' | 'capitalCities' | 'map';
//  | 'states';
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
  gameOn: boolean;
  questions: Question[];
  playerAnswers: { index: number; time: number }[];
  answers: number[];
  currentQuestion: number;
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

export interface GameReadyCountry extends ShrinkedCountry {
  gameType: GameType;
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

export interface GameTypeCardData {
  title: string;
  value: GameType;
  Icon: Icon;
}

export type GameTypeCardProps = {
  cardData: GameTypeCardData;
  settings: PreferenceSettings;
  gameForm: UseFormReturnType<GameCreationForm>;
};

export interface DependenceChoiceTypes {
  settings: PreferenceSettings;
  gameForm: UseFormReturnType<GameCreationForm>;
}

export interface RegionsSelectTypes {
  settings: PreferenceSettings;
  gameForm: UseFormReturnType<GameCreationForm>;
}

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
