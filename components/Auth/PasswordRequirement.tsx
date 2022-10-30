import { Box, Center, Text } from '@mantine/core';
import { X } from 'tabler-icons-react';

export const PasswordRequirement = ({ label }: { meets: boolean; label: string }) => {
  return (
    <Text color={'red'} size='sm'>
      <Center inline>
        <X size={14} />
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
};
