import { Container, Grid, Skeleton } from '@mantine/core';
import { Feature } from '../Feature/Feature';

export function HomeSecond() {
  return (
    <Container mt={300} my="md">
      <Grid gutter="xl">
        <Grid.Col xs={6}>
          <Feature
            title="Learn Gamemode"
            description="Place where you can learn before... lalala..."
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <Feature
            title="Challenge Gamemode"
            description="Compete with other players... lalalla..."
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <Feature
            title="Easy/Medium/Hard"
            description="Choose a difficulty that matches your knowledge"
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <Feature
            title="Custom Games"
            description="Select the matter in which you want to challenge yourself"
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <Feature
            title="Daily rewards"
            description="There are rewards you can redeem everyday for free"
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <Feature title="No ads" description="Enjoy the ads free experience" />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
