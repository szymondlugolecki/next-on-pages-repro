// Hooks
import { useRouter } from 'next/router';

// Components
import { Container, Grid } from '@mantine/core';
import { StoreProduct } from '../components/StoreProduct/StoreProduct';
import { Loading } from '../components/Loading/Loading';

// Types

// Styles
import styles from './Store.styles';

// Client-Side Constants & Functions
import { storeProducts } from '../lib/constants';
import AuthHook from '../lib/authHook';

export default function StorePage() {
  const { classes } = styles();

  const { push } = useRouter();

  const { user, status } = AuthHook({
    onUnauthenticated() {
      push('/login');
    },
  });

  if (!user || status !== 'authenticated') return <Loading />;

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
