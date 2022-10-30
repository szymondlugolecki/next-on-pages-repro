import { Group, Paper, SimpleGrid, Text } from '@mantine/core';

import styles from './Feature.styles';

interface Feature {
  title: String;
  description: String;
}

export function Feature({ title, description }: Feature) {
  const { classes } = styles();

  return (
    <Paper className={classes.feature} shadow="lg">
      <div className={classes.leftBar} />
      <SimpleGrid cols={1} spacing={0} py="lg">
        <Text size="lg" weight="bold" transform="uppercase">
          {title}
        </Text>
        <Text size="md">{description}</Text>
      </SimpleGrid>
    </Paper>
  );
}
