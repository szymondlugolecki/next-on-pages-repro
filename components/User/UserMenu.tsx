import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Logout, Settings, User as UserIcon } from 'tabler-icons-react';

export function UserMenu({ user }: { user: User }) {
  const { push } = useRouter();

  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={user.image} alt='Your avatar' size={42} radius='xl' color='indigo' />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user.nickname}</Menu.Label>
        <Menu.Item
          component='button'
          icon={<UserIcon size={14} />}
          onClick={() => push(`/profile/me`)}
        >
          Profile
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
