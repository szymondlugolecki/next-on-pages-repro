import React from 'react';
import { Avatar } from '@mantine/core';
import { UserCircle } from 'tabler-icons-react';

export function AvatarPlaceholder() {
  return (
    <Avatar radius="xl" size="md" src={null} alt="Avatar Placeholder">
        <UserCircle size={40} strokeWidth={1} color="white" />
    </Avatar>
  );
}
