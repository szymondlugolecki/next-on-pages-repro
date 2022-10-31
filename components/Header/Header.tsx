import { Burger, Container, Group, Header, Paper, Transition } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import Link from 'next/link';
import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Globe } from 'tabler-icons-react';
import { UserMenu } from '../User/UserMenu';

import type { HeaderLink } from '../../types/GameplayTypes';

import styles from './Header.styles';

const HEADER_HEIGHT = 60;

export function HeaderLayout({ links }: { links: HeaderLink[] }) {
  const { pathname } = useRouter();
  const initialURL = links.find((link) => link.url === pathname)?.url || links[0].url;
  const { data: session, status } = useSession();
  const [opened, toggleOpened] = useToggle([false, true]);
  const [active, setActive] = useState(initialURL);
  const { classes, cx } = styles();

  const items = links.map(({ label, url, unauthedOnly }, index) => {
    if (unauthedOnly && status === 'authenticated') return null;
    return (
      <Link href={url} key={label}>
        <a
          role='link'
          tabIndex={index}
          className={cx(classes.link, { [classes.linkActive]: active === url })}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setActive(url);
              toggleOpened();
            }
          }}
          onClick={() => {
            // event.preventDefault();
            setActive(url);
            toggleOpened();
          }}
        >
          {label}
        </a>
      </Link>
    );
  });

  const { user } = session || {};

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          {items}
          {session && <UserMenu user={user} />}
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
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
