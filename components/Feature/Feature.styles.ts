import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  leftBar: {
    width: '7px',
    height: '105px',
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
      theme.colors[theme.primaryColor][7]
    } 100%)`,
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    marginRight: '15px',
  },
  feature: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));
