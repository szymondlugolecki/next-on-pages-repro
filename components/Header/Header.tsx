import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Header,
  Container,
  Burger,
  Paper,
  Transition,
  Menu,
  Group,
  Avatar,
  UnstyledButton,
  Button,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { Globe, User, Settings, ChartLine, Logout } from 'tabler-icons-react';

import { signOut, useSession } from 'next-auth/react';

import styles from './Header.styles';

const HEADER_HEIGHT = 60;

export function HeaderLayout({ links }: { links: { link: string; label: string }[] }) {
  const { push } = useRouter();
  const { data: session } = useSession();
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

  // const getMe = async () => {
  //   try {
  //     const { data } = await instance.get<UserResponse>('/users/me');
  //     showInfo(`Your name is ${data.username}`);
  //     console.log('data', data);
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // };

  const { user } = session || {};

  function UserMenu() {
    return (
      user && (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton>
              <Avatar src={user.image} alt="Your avatar" size={42} radius="xl" color="blue" />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{user.name}</Menu.Label>
            <Menu.Item
              component="button"
              icon={<User size={14} />}
              onClick={() => push(`/profile/${user.name}`)}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              component="button"
              icon={<ChartLine size={14} />}
              onClick={() => push(`/profile/${user.name}/stats`)}
            >
              Statistics
            </Menu.Item>
            <Menu.Item
              component="button"
              icon={<Settings size={14} />}
              onClick={() => push('/settings')}
            >
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<Logout size={14} />}
              component="button"
              onClick={() => signOut({ redirect: true, callbackUrl: '/home' })}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )
    );
  }

  const getSomething = () => {
    fetch('http://localhost:8787/api/auth/me').then(async (res) => {
      const response = await res.json();
      console.log(response);
    });
  };

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          <Button onClick={getSomething} size="md">
            Get me
          </Button>
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
