import { Container, Grid } from '@mantine/core';
import { Feature } from '../Feature/Feature';

import { geopolisFeatures } from '../../lib/constants';

export function HomeSecond({ targetRef }: { targetRef: React.MutableRefObject<HTMLDivElement> }) {
  return (
    <Container mt={300} my='md' ref={targetRef}>
      <Grid gutter='xl'>
        {geopolisFeatures.map((feature, index) => (
          <Grid.Col xs={6} key={index}>
            <Feature {...feature} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
