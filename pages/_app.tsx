import Head from 'next/head';

// import { SessionProvider } from 'next-auth/react';

import type { AppProps } from 'next/app';

// import { Session } from 'next-auth';

// AppProps & { pageProps: { session: Session | null } }

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>geopolis.io</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <meta charSet='UTF-8' />
        <link rel='icon' href='/favicon.svg' />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
