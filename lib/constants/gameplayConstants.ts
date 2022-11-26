import { Dependence, Gamemode, GameModeSetting, GameType, Region } from '../../types/Game';

export const challengeQuestionLimit = 30;
export const allRegions: Region[] = ['europe', 'americas', 'africa', 'asia', 'oceania'];
export const dependenceList: Dependence[] = ['all', 'dependent', 'independent'];
export const availableGamemodes = ['learn', 'challenge:solo'];
export const oneGameTypeGamemodes = ['learn'];
export const shareAnswersGamemodes = ['learn'];
export const gameTypesX: { name: GameType; label: string }[] = [
  {
    name: 'capitalCities',
    label: 'Capital Cities',
  },
  {
    name: 'flags',
    label: 'Flags',
  },
  {
    name: 'map',
    label: 'World Map',
  },
];

export const gameTypesList = gameTypesX.map((gm) => gm.name);
export const gamemodesSettings: GameModeSetting[] = [
  {
    name: 'learn',
    rules: [
      'You can only choose one game type',
      "Playing this game mode won't affect your stats",
      'This is supposed to prepare you for the Challenge game mode',
    ],
    gameTypes: {
      multipleSelection: false,
      mustSelectAll: false,
    },
    regions: {
      multipleSelection: true,
      mustSelectAll: false,
    },
    dependence: {
      multipleSelection: false,
      mustSelectAll: false,
    },
  },
  {
    name: 'challenge:solo',
    rules: [],
    gameTypes: {
      multipleSelection: true,
      mustSelectAll: false,
    },
    regions: {
      multipleSelection: true,
      mustSelectAll: true,
    },
    dependence: {
      multipleSelection: false,
      mustSelectAll: true,
    },
  },
  {
    name: 'challenge:multiplayer',
    rules: [],
    gameTypes: {
      multipleSelection: true,
      mustSelectAll: false,
    },
    regions: {
      multipleSelection: true,
      mustSelectAll: true,
    },
    dependence: {
      multipleSelection: false,
      mustSelectAll: false,
    },
  },
];
export const gamemodes: Gamemode[] = gamemodesSettings.map(
  (gamemodeSettings) => gamemodeSettings.name,
);
