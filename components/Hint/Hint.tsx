// Hooks
// import Image from 'next/image';

// Components
import { Center, Container, Image, Text } from '@mantine/core';
import { Map } from '../Map/Map';
// @ts-ignore

// Types
import type { GameType, Region, Subregion } from '../../types/GameplayTypes';

// Styles

// Client-Side Constants & Functions

export function Hint({
  gameType,
  hint,
  regionData: { region, subregion },
}: {
  gameType: GameType;
  hint: string;
  flags?: JSX.Element[];
  index: number;
  regionData: {
    region: Region;
    subregion: Subregion;
  };
}) {
  const HintInside = () => {
    switch (gameType) {
      case 'map':
        return <Map hint={hint} region={region} subregion={subregion} />;
      case 'capitalCities':
        return (
          <Text size='xl' weight={700}>
            {hint}
          </Text>
        );
      case 'flags':
        return (
          <Container size='xl' style={{ display: 'block', position: 'relative' }}>
            <Image radius='md' src={`https://countryflagsapi.com/png/${hint}`} alt='Country Flag' />
          </Container>
        );
      default:
        return null;
    }
  };

  return (
    <Center py='xl' style={{ height: '26rem' }}>
      <HintInside />
    </Center>
  );
}

/**
 * EUROPE: ANDORRA, MONACO, VATICAN CITY, GIBRALTAR, LIECHTENSTEIN, SAN MARINO, MALTA
 * OCEANIA: Micronesia, Tonga, Samoa, Nauru, Kiribati, Tuvalu, Palau, Marshall Islands
 *
 * Geo's to add:
 * Svalbard and Jan Mayen
 * Malta
 * Isle of Man
 * Gibraltar
 * Monaco
 * Jersey
 * Faroe Islands
 * Åland Islands
 * Vatican City
 * San Marino
 * France XD
 * Guernsey
 *
 * https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json
 */

// [✅] questions repeat themselves??? ✔
// [✅] error when running out of questions
// [✅] monitor response time to calculate average response time etc. in the end ❌
// [❌] add counter x / y of how many questions left + mby quit button? ❌
// [✅] add missing countries to the topology/remove dependency choice
// [✅] add region & subregion support for maps (americas is too large, split to 3 americas + carribean)
