import { useState } from 'react';

import { AppProps } from 'next/app';
import Head from 'next/head';

import { MantineProvider, ColorScheme, AppShell } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { FooterLayout } from '../components/Footer/Footer';
import { HeaderLayout } from '../components/Header/Header';

import { theme } from './_theme';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

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
        <title>GeoAcademio</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
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
    </>
  );
}
