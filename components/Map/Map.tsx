// Hooks

// Components
// @ts-ignore
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Types
import type { Region, Subregion } from '../../types/GameplayTypes';

// Styles
// import styles from './Hint.styles';

// Client-Side Constants & Functions
import { defaultConfig, geoURL, map } from '../../lib/constants';

export function Map({
  hint,
  region,
  subregion,
}: {
  hint: string;
  region: Region;
  subregion: Subregion;
}) {
  const configByRegion =
    map.find((r) => r.name === region) || map.find((r) => r.name === subregion) || defaultConfig;

  return (
    <ComposableMap projectionConfig={configByRegion} projection='geoEqualEarth'>
      <Geographies geography={geoURL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            if (geo.properties['Alpha-2'] === hint) console.log(geo.properties['Alpha-2']);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={
                  [geo.properties.iso_a2_eh, geo.properties.iso_a2].includes(hint)
                    ? '#fa5252'
                    : '#69db7c'
                }
                stroke='black'
                strokeWidth={0.75}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}