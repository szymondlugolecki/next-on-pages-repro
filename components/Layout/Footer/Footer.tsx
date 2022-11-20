import { Anchor, Container, Group } from '@mantine/core';
import { Globe } from 'tabler-icons-react';

import { footerLinks } from '../../../lib/constants';
import styles from './Footer.styles';

export default function FooterLayout() {
  const { classes } = styles();
  const items = footerLinks.map((link) => (
    <Anchor<'a'>
      color='dimmed'
      key={link.label}
      href={link.url}
      onClick={(event) => event.preventDefault()}
      size='sm'
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
