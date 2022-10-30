import { Container, Center, Loader } from '@mantine/core';

import styles from './Loading.styles';

export function Loading() {
  const { classes } = styles();
  return (
    <Container size="xs" className={classes.container}>
      <Center className={classes.loadingCenter}>
        <Loader size="xl" variant="dots" />
      </Center>
    </Container>
  );
}
