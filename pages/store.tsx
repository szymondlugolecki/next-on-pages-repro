// Hooks

// Components
import { Container, Grid } from '@mantine/core';
import { StoreProduct } from '../components/StoreProduct/StoreProduct';

// Types

// Styles
import styles from './Store.styles';

// Client-Side Constants & Functions
import { storeProducts } from '../lib/constants';

export default function StorePage() {
  const { classes } = styles();

  return (
    <Container className={classes.inner}>
      <Grid grow gutter="xl" columns={24}>
        {storeProducts.map((product, index) => (
          <Grid.Col span={8} key={index}>
            <StoreProduct product={product} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
