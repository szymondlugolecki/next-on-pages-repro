import { createStyles } from '@mantine/core';

export default createStyles((theme, _params, getRef) => ({
  imageContainer: {
    ref: getRef('imageContainer'),
    width: '50vw',
    height: '50vh',
    // object-fit: 'contain';
    // width: 100% !important;
    // position: relative !important;
    // height: unset !important;
  },

  image: {
    width: '100%',
    height: '100%',
    position: 'relative',
    objectFit: 'cover',
  },
}));
