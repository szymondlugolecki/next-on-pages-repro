import Head from 'next/head';

import { AppShell, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';

import type { AppProps } from 'next/app';
import { FooterLayout } from '../components/Footer/Footer';
import { HeaderLayout } from '../components/Header/Header';

import { RouterTransition } from '../components/RouterTransition/RouterTransition';

import { Session } from 'next-auth';
import { footerLinks, headerLinks } from '../lib/constants';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'green',
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: Session | null } }) {
  return (
    <>
      <Head>
        <title>geopolis.io</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <meta charSet='UTF-8' />
        <link rel='icon' href='/favicon.svg' />
      </Head>

      <SessionProvider session={session}>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
          <RouterTransition />
          <NotificationsProvider>
            <AppShell
              fixed
              footer={<FooterLayout links={footerLinks} />}
              header={<HeaderLayout links={headerLinks} />}
            >
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
