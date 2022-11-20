import { Burger, Container, Group, Header, Paper, Transition } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Globe } from 'tabler-icons-react';
import { UserMenu } from '../../User/UserMenu';
import HeaderLinks from './HeaderLinks';

import styles from './Header.styles';

import { headerLinks } from '../../../lib/constants';

export default function HeaderLayout() {
  const { classes } = styles();
  const { pathname } = useRouter();
  const initialURL = headerLinks.find((link) => link.url === pathname)?.url || headerLinks[0].url;
  const { data: session, status } = useSession();
  const [opened, toggleOpened] = useToggle([false, true]);
  const [active, setActive] = useState(initialURL);

  const headerLinksProps = {
    active,
    setActive,
    toggleOpened,
    status,
  };

  return (
    <Header height={60} className={classes.header}>
      <Container className={classes.headerContainer}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          <HeaderLinks {...{ ...headerLinksProps, shrink: false }} />
          {session && <UserMenu user={session.user} />}
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size='sm'
        />

        <Transition transition='pop-top-right' duration={200} mounted={opened}>
          {(style) => (
            <Paper className={classes.dropdown} withBorder style={style}>
              <HeaderLinks {...{ ...headerLinksProps, shrink: true }} />
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
