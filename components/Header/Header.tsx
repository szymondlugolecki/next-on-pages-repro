import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { Header, Container, Group, Burger, Paper, Transition, Text, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { Globe } from 'tabler-icons-react';
import { UserContext } from '../../lib/userContext';

import styles from './Header.styles';
import instance from '../../lib/api';

interface HeaderLayout {
  links: { link: string; label: string }[];
}

const HEADER_HEIGHT = 60;

export function HeaderLayout({ links }: HeaderLayout) {
  const { user } = useContext(UserContext) || {};
  const [opened, toggleOpened] = useToggle([false, true]);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = styles();

  const items = links.map((link, index) => (
    <Link href={link.link} key={link.label}>
      <a
        role="link"
        tabIndex={index}
        className={cx(classes.link, { [classes.linkActive]: active === link.link })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setActive(link.link);
            toggleOpened();
          }
        }}
        onClick={() => {
          // event.preventDefault();
          setActive(link.link);
          toggleOpened();
        }}
      >
        {link.label}
      </a>
    </Link>
  ));

  const getMe = async () => {
    try {
      const { status, data } = await instance.get('/users/me');
      console.log(status, 'data', data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const logOut = async () => {
    try {
      const { status, data } = await instance.get('/auth/logout');
      console.log('Logout', status, data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  console.log('user', user);

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          <Button onClick={logOut}>Log out</Button>
          <Button onClick={getMe}>Get me</Button>
          {items}
          {user && <Text>{user.email}</Text>}
          {!user && 'Not logged in'}
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
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
