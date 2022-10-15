import Link from 'next/link';

import { Image, Container, Title, Button, Group, Text, List, ThemeIcon } from '@mantine/core';
import { Check } from 'tabler-icons-react';

import styles from './HomeFirst.styles';

import image from './world.svg';

interface ScrollIntoViewAnimation {
  /** target element alignment relatively to parent based on current axis */
  alignment?: 'start' | 'end' | 'center';
}

export function HomeFirst({
  scrollFunc,
}: {
  scrollFunc: (params: ScrollIntoViewAnimation | undefined) => void;
}) {
  const { classes } = styles();

  return (
    <Container className={classes.inner}>
      <div className={classes.content}>
        <Title className={classes.title}>
          <span className={classes.highlight}>geopolis.io</span>
        </Title>
        <Text color="dimmed" mt="md">
          Take geography to the next level.
        </Text>

        <List
          mt={30}
          spacing="sm"
          size="sm"
          icon={
            <ThemeIcon size={20} radius="xl">
              <Check size={12} />
            </ThemeIcon>
          }
        >
          <List.Item>
            <b>Learn</b> - Educate yourself on countries, flags, capital cities and more.
          </List.Item>
          <List.Item>
            <b>Play</b> - Put your knowledge to the test and compete with your friends or players
            from all around the globe.
          </List.Item>
          <List.Item>
            <b>Level up</b> - Stats, ranking and leveling system will help you watch your progress
            and compare with other players.
          </List.Item>
        </List>

        <Group mt={30}>
          <Link href="play" passHref>
            <Button radius="xl" size="md" className={classes.control}>
              Play now
            </Button>
          </Link>
          <Button
            variant="default"
            radius="xl"
            size="md"
            className={classes.control}
            onClick={() => scrollFunc({ alignment: 'center' })}
          >
            Read more
          </Button>
        </Group>
      </div>
      <Image src={image.src} className={classes.image} />
    </Container>
  );
}
