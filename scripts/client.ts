import { StatsProps, LearnModeCard, Region, Preference, Dependence } from '../types/Types';

export const challengeQuestionLimit = 30;
export const regions: Region[] = ['europe', 'americas', 'africa', 'asia', 'oceania'];
export const gamemodes = ['learn', 'challenge:solo', 'challenge:multiplayer'];
export const preferencesList: Preference[] = ['capitalCities', 'flags', 'map'];
export const dependenceOptions: Dependence[] = ['all', 'dependentOnly', 'independentOnly'];
export const availableGamemodes = ['learn', 'challenge:solo'];

export const postData = async (url: string, data: any) =>
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const capitalize = (text: string) => {
  return text
    .split(' ')
    .map((word: string) => {
      word = word.toUpperCase();
      return word.charAt(0) + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export const dependenceData = [
  { value: 'all', label: 'All' },
  { value: 'independentOnly', label: 'Independent' },
  { value: 'dependentOnly', label: 'Depenedent' },
];

export const learnModeCardsData: LearnModeCard[] = [
  {
    title: 'Capital Cities',
    description:
      'Learn capital cities. On each question you will be shown a country name and four different capitals as answers on your screen, only ONE of them is correct, the other answers are wrong',
    value: 'capitalCities',
  },
  {
    title: 'Map',
    description:
      'Learn the world map. One country will be marked on the world map and your job will be to select the correct answer containing the name of the country',
    value: 'map',
  },
  {
    title: 'Flags',
    description:
      'Learn country flags. A random coutry flag will appear on your screen and you will have to select the answer with the name of the country. Only one answer is correct',
    value: 'flags',
  },
];

export const statsLearnData: StatsProps = {
  data: [
    { label: 'Correct Answers', stats: '15230', progress: 89, color: 'green', icon: 'up' },
    { label: 'Games Won', stats: '1024', progress: 78, color: 'blue', icon: 'up' },
    { label: 'Play Time', stats: '15 hours', progress: 24, color: 'red', icon: 'down' },
  ],
};

export const statsChallengeData: StatsProps = {
  data: [
    { label: 'Correct Answers', stats: '11203', progress: 92, color: 'green', icon: 'up' },
    { label: 'Games Won', stats: '685', progress: 96, color: 'blue', icon: 'up' },
    { label: 'Current Win-Streak', stats: '2', progress: 40, color: 'red', icon: 'down' },
  ],
};

export const headerLinks = [
  { link: '/home', label: 'Home' },
  { link: '/store', label: 'Store' },
];

export const footerLinks = [
  { link: '/tos', label: 'Terms of Service' },
  { link: '/privacy', label: 'Privacy Policy' },
  { link: '/contact', label: 'Contact' },
];
