import { AppProps } from 'next/app';
import Head from 'next/head';

import { SessionProvider } from 'next-auth/react';

import { MantineProvider, ColorScheme, AppShell } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { FooterLayout } from '../components/Footer/Footer';
import { HeaderLayout } from '../components/Header/Header';

import { Session } from 'next-auth';

import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'green',
};

// App(props: AppProps & { colorScheme: ColorScheme })

export default function App(props: AppProps & { pageProps: { session: Session } }) {
  const { Component, pageProps } = props;
  const session = pageProps.session;

  const headerLinks = [
    { link: '/home', label: 'Home' },
    { link: '/store', label: 'Store' },
  ];

  const footerLinks = [
    { link: '/tos', label: 'Terms of Service' },
    { link: '/privacy', label: 'Privacy Policy' },
    { link: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <Head>
        <title>geopolis.io</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <SessionProvider session={session}>
          <NotificationsProvider>
            <AppShell
              fixed
              footer={<FooterLayout links={footerLinks} />}
              header={<HeaderLayout links={headerLinks} />}
            >
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </SessionProvider>
      </MantineProvider>
    </>
  );
}
