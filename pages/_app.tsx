import Head from 'next/head';

import { AppShell, Container, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';

import type { AppProps } from 'next/app';
import FooterLayout from '../components/Layout/Footer';
import HeaderLayout from '../components/Layout/Header';

import RouterTransition from '../components/RouterTransition';

import { Session } from 'next-auth';

export const themeOverride: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'green',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#0f0f0f',
      '#141517',
      '#101113',
    ],
  },
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
        <MantineProvider theme={themeOverride} withNormalizeCSS withGlobalStyles>
          <RouterTransition />
          <NotificationsProvider>
            <AppShell fixed header={<HeaderLayout />} footer={<FooterLayout />}>
              <Container sx={() => ({ height: '100%' })}>
                <Component {...pageProps} />
              </Container>
            </AppShell>
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
