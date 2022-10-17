import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header, Container, Burger, Paper, Transition, Menu, Group, Avatar, UnstyledButton } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { Globe, User, Settings, ChartLine, Logout } from 'tabler-icons-react';
import { useUser } from '../../lib/userContext';

import styles from './Header.styles';
import { showError, showSuccess } from '../../lib/functions';

const HEADER_HEIGHT = 60;

export function HeaderLayout({ links }: { links: { link: string; label: string }[] }) {
  const { user, doLogout } = useUser() || {};
  const { push } = useRouter();
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

  const logOut = async () => {
    try {
      await doLogout();
      showSuccess('Successfully logged out');
    } catch (error: any) {
      showError('Unexpected error');
    }
  };

  const UserMenu = () => user && (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={user.avatar} alt="Your avatar" size={42} radius="xl" color="blue" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user.username}</Menu.Label>
        <Menu.Item component="button" icon={<User size={14} />} onClick={() => push(`/profile/${user.nickname}`)}>Profile</Menu.Item>
        <Menu.Item component="button" icon={<ChartLine size={14} />} onClick={() => push(`/profile/${user.nickname}/stats`)}>Statistics</Menu.Item>
        <Menu.Item component="button" icon={<Settings size={14} />} onClick={() => push('/settings')}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" icon={<Logout size={14} />} component="button" onClick={logOut}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>);

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Globe />
        <Group spacing={5} className={classes.links}>
          {/* <Button onClick={getMe} size="md">Get me</Button> */}
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
