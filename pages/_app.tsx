import { AppProps } from 'next/app';
import Head from 'next/head';

import { AppShell, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { FooterLayout } from '../components/Footer/Footer';
import { HeaderLayout } from '../components/Header/Header';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { RouterTransition } from '../components/RouterTransition/RouterTransition';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'green',
};

// App(props: AppProps & { colorScheme: ColorScheme })

import { headerLinks, footerLinks } from '../scripts/client';

export default function App(props: AppProps & { session: Session }) {
  const { Component, pageProps } = props;
  const session = pageProps.session;

  return (
    <>
      <Head>
        <title>geopolis.io</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
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
