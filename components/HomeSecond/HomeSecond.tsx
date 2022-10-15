import { Container, Grid, Skeleton } from '@mantine/core';
import { Feature } from '../Feature/Feature';
import { useScrollIntoView } from '@mantine/hooks';

import { geopolisFeatures } from '../../lib/constants';

export function HomeSecond({ targetRef }: { targetRef: React.MutableRefObject<HTMLDivElement> }) {
  return (
    <Container mt={300} my="md" ref={targetRef}>
      <Grid gutter="xl">
        {geopolisFeatures.map((feature) => (
          <Grid.Col xs={6}>
            <Feature {...feature} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
