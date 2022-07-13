import React from 'react';
import { Container, Group, Anchor } from '@mantine/core';
import { Globe } from 'tabler-icons-react';

import styles from './Footer.styles';

interface FooterLayout {
  links: { link: string; label: string }[];
}

export function FooterLayout({ links }: FooterLayout) {
  const { classes } = styles();
  const items = links.map((link) => (
    <Anchor<'a'>
      color="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Globe />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
