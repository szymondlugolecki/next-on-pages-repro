import React, { useState } from 'react';
import Link from 'next/link';
import { Header, Container, Group, Burger, Paper, Transition, Button, Menu, Text, NavLink } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { Globe, User, Settings, ChartLine, Logout } from 'tabler-icons-react';
import { useUser } from '../../lib/userContext';

import styles from './Header.styles';
import instance from '../../lib/api';
import { showInfo, showSuccess } from '../../lib/functions';
import { UserResponse } from '../../types/API';

interface HeaderLayout {
  links: { link: string; label: string }[];
}

const HEADER_HEIGHT = 60;

export function HeaderLayout({ links }: HeaderLayout) {
  const { user } = useUser() || {};
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
      const { data } = await instance.get<UserResponse>('/users/me');
      showInfo(`Your name is ${data.username}`);
      console.log('data', data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const logOut = async () => {
    try {
      await instance.get('/auth/logout');
      showSuccess('Successfully logged out');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const UserMenu = () => (
  <Menu shadow="md" width={200} transition="pop">
    <Menu.Target>
      <Button>{user?.username}</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Label>Your account</Menu.Label>
      <Menu.Item p={1}>
        <Link href="/profile/me" passHref>
          <NavLink label="Profile" icon={<User size={14} />} />
        </Link>
      </Menu.Item>
      <Menu.Item p={0}>
        <Link href="/profile/me/stats" passHref>
          <NavLink label="Statistics" icon={<ChartLine size={14} />} />
        </Link>
      </Menu.Item>
      <Menu.Item p={0}>
        <Link href="/settings" passHref>
          <NavLink label="Settings" icon={<Settings size={14} />} />
        </Link>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Label>Danger zone</Menu.Label>
      <Menu.Item color="red" icon={<Logout size={14} />} component="button" onClick={logOut}>Logout</Menu.Item>
    </Menu.Dropdown>
  </Menu>);

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          <Button onClick={logOut}>Log out</Button>
          <Button onClick={getMe}>Get me</Button>
          {items}
          {user && UserMenu()}
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
