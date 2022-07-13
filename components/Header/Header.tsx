import React, { useState } from 'react';
import { Header, Container, Group, Burger, Paper, Transition } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { Globe } from 'tabler-icons-react';

import styles from './Header.styles';
import Link from 'next/link';

interface HeaderLayout {
  links: { link: string; label: string }[];
}

const HEADER_HEIGHT = 60;

export function HeaderLayout({ links }: HeaderLayout) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = styles();

  const items = links.map((link) => (
    <Link href={link.link} key={link.label}>
      <a
        className={cx(classes.link, { [classes.linkActive]: active === link.link })}
        onClick={(event) => {
          // event.preventDefault();
          setActive(link.link);
          toggleOpened(false);
        }}
      >
        {link.label}
      </a>
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
