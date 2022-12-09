import CountriesData from 'world-countries';
import countriesWithTopology from '../../../public/countriesWithTopology.json';
import type {
  Dependence,
  ShrinkedCountry,
  Subregion,
  Region,
  GameType,
  GameReadyCountry,
} from '../../../types/Game';

const countries: ShrinkedCountry[] = CountriesData.map(
  ({ name, independent, capital, region, subregion, flag, cca2 }): ShrinkedCountry => ({
    name,
    independent,
    capital: capital.join(' / '),
    region: region.toLowerCase() as Region,
    subregion: subregion as Subregion,
    flag,
    cca2,
  }),
);
const mappableCountries = countries.filter(({ cca2 }) => countriesWithTopology.includes(cca2));

export { countries };

export const getDatasets = (gameTypes: GameType[], regions: Region[], dependence: Dependence) => {
  const datasets = new Map<GameType, GameReadyCountry[]>();

  const basicFilter = (dataset: ShrinkedCountry[], gameType: GameType): GameReadyCountry[] =>
    dataset
      .filter(({ region }) => regions.includes(region))
      .filter(({ independent }) => {
        if (dependence === 'all') return true;
        if (dependence === 'dependent' && independent === false) return true;
        if (dependence === 'independent' && independent === true) return true;
        return false;
      })
      .map((country) => ({ ...country, gameType }));

  gameTypes.forEach((gameType) => {
    if (['capitalCities', 'flags'].includes(gameType)) {
      datasets.set(gameType, basicFilter(countries, gameType));
    } else if (gameType === 'map') {
      datasets.set(gameType, basicFilter(mappableCountries, gameType));
    }
    // else if (gameType === 'states') {

    // }
  });

  return datasets;
};
