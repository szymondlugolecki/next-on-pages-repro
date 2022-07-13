import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },
  learnButton: {
    background: theme.fn.linearGradient(90, '#2f9e44', '#51cf66'),
  },
}));
