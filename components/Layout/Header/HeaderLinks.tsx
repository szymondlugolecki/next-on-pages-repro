import Link from 'next/link';
import type { SetStateAction } from 'react';
import styles from './Header.styles';

import { headerLinks } from '../../../lib/constants';

export default function HeaderLinks({
  active,
  setActive,
  toggleOpened,
  status,
  shrink,
}: {
  active: string;
  setActive: (value: SetStateAction<string>) => void;
  toggleOpened: (value?: SetStateAction<boolean> | undefined) => void;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  shrink: boolean;
}) {
  const { classes, cx } = styles();

  return (
    <>
      {headerLinks.map(({ label, url, unauthedOnly, menuItem }, index) => {
        if (unauthedOnly && status === 'authenticated') return null;
        if (!shrink && menuItem) return null;
        return (
          <Link href={url} key={label}>
            <a
              role='link'
              tabIndex={index}
              className={cx(classes.link, { [classes.linkActive]: active === url })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  setActive(url);
                  toggleOpened();
                }
              }}
              onClick={() => {
                // event.preventDefault();
                setActive(url);
                toggleOpened();
              }}
            >
              {label}
            </a>
          </Link>
        );
      })}
    </>
  );
}
