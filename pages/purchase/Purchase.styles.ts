import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },
  product: {
    border: `2px solid ${theme.colors.green[6]}`,
    borderRadius: '22px 1px 22px 1px',
  },
}));
