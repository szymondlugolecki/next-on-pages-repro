import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { User as SessionUser } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChartLine, Logout, Settings, User } from 'tabler-icons-react';

export function UserMenu({ user }: { user?: SessionUser | undefined }) {
  const { push } = useRouter();
  if (!user) return null;

  console.log('user', user);

  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={user.image} alt='Your avatar' size={42} radius='xl' color='blue' />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user.nickname}</Menu.Label>
        <Menu.Item
          component='button'
          icon={<User size={14} />}
          onClick={() => push(`/profile/${user.name}`)}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          component='button'
          icon={<ChartLine size={14} />}
          onClick={() => push(`/profile/${user.name}/stats`)}
        >
          Statistics
        </Menu.Item>
        <Menu.Item
          component='button'
          icon={<Settings size={14} />}
          onClick={() => push('/settings')}
        >
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color='red'
          icon={<Logout size={14} />}
          component='button'
          onClick={() => signOut({ redirect: true, callbackUrl: '/home' })}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
