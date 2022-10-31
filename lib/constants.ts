import { Crown, CrownOff, CurrentLocation, Flag2, Icon, Map, Omega } from 'tabler-icons-react';

import {
  Dependence,
  Gamemode,
  GameModeSetting,
  GameType,
  GameTypeCardData,
  Product,
  Region,
  StatsProps,
  Subregion,
} from '../types/GameplayTypes';

export const geopolisFeatures: { title: string; description: string }[] = [
  {
    title: 'Competitive Gamemode',
    description: 'Put your knowledge to the test, gain points and experience',
  },
  {
    title: 'Education Gamemode',
    description: 'Not ready to compete yet? Practice in Learn first',
  },
  {
    title: 'Track your progress',
    description: 'Free access to basic stats',
  },
  {
    title: 'World Map / Capital Cities / Flags',
    description: "Choose which category you're interested in",
  },
  {
    title: 'Daily rewards',
    description: 'Log in daily to collect treasure',
  },
  {
    title: 'Play with others - Coming Soon!',
    description: 'Challenge Multiplayer will be available in the future',
  },
];

const VIPFeatures = [
  'X2 XP Multiplier',
  'VIP Badge',
  'Access to in-depth stats',
  'One free color name change/day',
  'One free name change/day',
  'No ads',
];

export const storeProducts: Product[] = [
  {
    id: 2,
    name: 'Name Change',
    payment: {
      price: 0.99,
      type: 'onetime',
      stripe: 'https://buy.stripe.com/test_14k4kk9yy42pfCM145',
      paypal: '',
    },
    features: ['You can change your name once'],
  },
  {
    id: 4,
    name: 'Stats Reset',
    payment: {
      price: 1.99,
      type: 'onetime',
      stripe: 'https://buy.stripe.com/test_cN29EEdOO56tgGQ148',
      paypal: '',
    },
    features: ['You can reset your stats once'],
  },
  {
    id: 0,
    name: 'VIP',
    payment: {
      price: 3.99,
      type: 'subscription:monthly',
      stripe: 'https://buy.stripe.com/test_6oEdUU7qqeH30HS5kk',
      paypal: '',
    },
    features: VIPFeatures,
  },
  {
    id: 1,
    name: 'VIP',
    payment: {
      price: 2.99,
      type: 'subscription:yearly',
      total: 36,
      stripe: 'https://buy.stripe.com/test_14k3gg7qq7eBbmw003',
      paypal: '',
    },
    features: VIPFeatures,
  },
];
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

export const geoURL = 'http://localhost:3000/worldmap.geo.json';
export const defaultConfig: {
  scale: number;
  rotate: [number, number, number];
  center: [number, number];
} = {
  scale: 400,
  rotate: [0, 0, 0],
  center: [0, 0],
};

export const dependenceData: { value: Dependence; label: string; Icon: Icon }[] = [
  { value: 'all', label: 'All', Icon: Omega },
  { value: 'independent', label: 'Independent', Icon: Crown },
  { value: 'dependent', label: 'Depenedent', Icon: CrownOff },
];

export const gameModeCardData: GameTypeCardData[] = [
  {
    title: 'Capital Cities',
    value: 'capitalCities',
    Icon: CurrentLocation,
  },
  {
    title: 'Flags',
    value: 'flags',
    Icon: Flag2,
  },
  {
    title: 'World Map',
    value: 'map',
    Icon: Map,
  },
];

export const statsLearnData: StatsProps = {
  data: [
    {
      label: 'Correct Answers',
      stats: '15230',
      progress: 89,
      color: 'green',
      icon: 'up',
    },
    {
      label: 'Games Won',
      stats: '1024',
      progress: 78,
      color: 'blue',
      icon: 'up',
    },
    {
      label: 'Play Time',
      stats: '15 hours',
      progress: 24,
      color: 'red',
      icon: 'down',
    },
  ],
};

export const statsChallengeData: StatsProps = {
  data: [
    {
      label: 'Correct Answers',
      stats: '11203',
      progress: 92,
      color: 'green',
      icon: 'up',
    },
    {
      label: 'Games Won',
      stats: '685',
      progress: 96,
      color: 'blue',
      icon: 'up',
    },
    {
      label: 'Current Win-Streak',
      stats: '2',
      progress: 40,
      color: 'red',
      icon: 'down',
    },
  ],
};

export const headerLinks = [
  { url: '/home', label: 'Home' },
  { url: '/play', label: 'Play' },
  { url: '/store', label: 'Store' },
  { url: '/auth/login', label: 'Login', unauthedOnly: true },
];

export const footerLinks = [
  { link: '/tos', label: 'Terms of Service' },
  { link: '/privacy', label: 'Privacy Policy' },
  { link: '/contact', label: 'Contact' },
];

export const mapExceptions = [
  'Antarctica',
  'French Southern and Antarctic Lands',
  'Bouvet Island',
  'Heard Island and McDonald Islands',
  'South Georgia',
];

export const map: {
  name: Region | Subregion;
  rotate?: [number, number, number];
  center?: [number, number];
  scale: number;
}[] = [
  {
    name: 'europe',
    rotate: [0, 0, 0],
    center: [14, 52],
    scale: 910,
  },
  {
    name: 'North America',
    rotate: [0, 0, 0],
    center: [-80, 35],
    scale: 400,
  },
  {
    name: 'South America',
    rotate: [0, 0, 0],
    center: [-60, -20],
    scale: 400,
  },
  {
    name: 'asia',
    rotate: [0, 0, 0],
    center: [80, 28],
    scale: 400,
  },
  {
    name: 'oceania',
    rotate: [-150, 20, 3],
    center: [0, 0],
    scale: 600,
  },
  {
    name: 'africa',
    rotate: [0, 0, 0],
    center: [15, 1.5],
    scale: 400,
  },
  {
    name: 'Caribbean',
    rotate: [0, 0, 0],
    center: [-70, 15],
    scale: 500,
  },
  {
    name: 'Central America',
    rotate: [0, 0, 0],
    center: [-70, 15],
    scale: 500,
  },
];
