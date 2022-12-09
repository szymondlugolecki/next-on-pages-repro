import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { useAuth } from '../../lib/swrClient';
import { useRouter } from 'next/router';
import { Logout, Settings, User as UserIcon } from 'tabler-icons-react';
import { PrivateUser } from '../../types';

export function UserMenu({ user }: { user: PrivateUser }) {
  const { push } = useRouter();
  const { signOut } = useAuth();

  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={user.avatar} alt='Your avatar' size={42} radius='xl' color='indigo' />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user.nickname}</Menu.Label>
        <Menu.Item
          component='button'
          icon={<UserIcon size={14} />}
          onClick={() => push(`/profile/${user.nickname}`)}
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
          onClick={() => signOut()}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
