import { createStyles } from '@mantine/core';

const HEADER_HEIGHT = 60;
const EXTRA_HEIGHT = 16;
const margin = `${HEADER_HEIGHT * 3 + EXTRA_HEIGHT * 2}px`;

export default createStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  loadingCenter: {
    marginBottom: margin,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

// calc(var(--mantine-header-height, 0px) + 16px)
