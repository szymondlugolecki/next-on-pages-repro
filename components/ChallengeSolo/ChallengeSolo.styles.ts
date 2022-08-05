import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  gamemodeSwitch: {
    label: { cursor: 'pointer' },
    input: { cursor: 'pointer' },
  },
  checkbox: {
    label: {
      cursor: 'pointer',
      userSelect: 'none',
    },
    input: { cursor: 'pointer' },
  },
}));
