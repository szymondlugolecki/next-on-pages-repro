import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },
  gamemodeSwitch: {
    label: { cursor: 'pointer' },
    input: { cursor: 'pointer' },
  },
}));
