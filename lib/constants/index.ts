import { Crown, CrownOff, CurrentLocation, Flag2, Icon, Map, Omega } from 'tabler-icons-react';

import { Dependence, GameTypeCardData, Region, Subregion } from '../../types/GameplayTypes';

export {
  allRegions,
  availableGamemodes,
  challengeQuestionLimit,
  dependenceList,
  gamemodes,
  gamemodesSettings,
  gameTypesList,
  gameTypesX,
  oneGameTypeGamemodes,
  shareAnswersGamemodes,
} from './gameplayConstants';
export { ducatsShop, storeProducts } from './storeConstants';

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

export const geoURL = `${process.env.NEXT_PUBLIC_API_URL}/worldmap.geo.json`;
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

export const headerLinks = [
  { url: '/home', label: 'Home' },
  { url: '/play', label: 'Play' },
  { url: '/purchase', label: 'Purchase' },
  { url: '/profile/me', label: 'Profile', menuItem: true },
  { url: '/settings', label: 'Settings', menuItem: true },
  { url: '/auth/login', label: 'Login', unauthedOnly: true },
];

export const footerLinks = [
  { url: '/tos', label: 'Terms of Service' },
  { url: '/privacy', label: 'Privacy Policy' },
  { url: '/contact', label: 'Contact' },
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
