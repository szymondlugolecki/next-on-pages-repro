import { Container, Paper, Title, Stack } from '@mantine/core';
// import { useVerification } from '../../../lib/swrClient';
import type { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { extractBrowserInfo } from '../../../lib/edgeFunctions';
import client from '../../../lib/prismaClient';
import {
  createAccessToken,
  createATCookie,
  createRefreshToken,
} from '../../../lib/server/createToken';

// import { useAuth } from '../../../lib/swrClient';

const SuccessComponent = () => {
  return (
    <>
      <Title color='green.4' order={1}>
        Success
      </Title>
      <Title order={5}>Redirecting in 3 seconds...</Title>
    </>
  );
};

const ErrorComponent = ({ error }: { error: string }) => {
  return (
    <Stack>
      <Title color='red.4' order={1}>
        Error
      </Title>
      <Title order={5}>{error}</Title>
    </Stack>
  );
};

const DisplayState = ({
  refreshToken,
  error,
}: {
  refreshToken: string | null;
  error: string | null;
}) => {
  const isVerified = Boolean(refreshToken);

  if (error) return <ErrorComponent error={error} />;
  if (isVerified) return <SuccessComponent />;

  return null;
};

const errorProps = (error: string) => ({
  props: {
    runtime: process.env.NEXT_RUNTIME,
    success: false,
    error,
  },
});

const threeWeeks = 1000 * 60 * 60 * 24 * 21;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  console.log('query', query);
  const ua = req.headers['user-agent'] ?? null;
  const browserInfo = extractBrowserInfo(ua);
  // const { href, origin, search, searchParams, pathname } = req.nextUrl;
  // console.log({ href, origin, search, searchParams, pathname });

  if (!query.token || typeof query.token !== 'string')
    return errorProps('Invalid verification token');

  const userByVerifyID = await client.user.findUnique({ where: { verifyID: query.token } });

  if (!userByVerifyID) return errorProps('Invalid verification token');
  console.log('browserInfo', browserInfo);

  // Devalidate verification token
  const user = await client.user.update({
    where: { verifyID: query.token },
    data: { verifyID: null },
  });

  const refreshToken = await createRefreshToken({ browserInfo, userId: user.id });

  const userTokensData = {
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + threeWeeks),
    browserInfo,
  };

  await client.userTokens.create({
    data: userTokensData,
  });

  const accessToken = await createAccessToken({ browserInfo, user });
  const accessTokenCookie = createATCookie(accessToken);

  res.setHeader('Set-Cookie', accessTokenCookie);

  return {
    props: {
      runtime: process.env.NEXT_RUNTIME,
      success: true,
      error: '',
      refreshToken,
    },
  };
};

//
const Verifying = ({
  success,
  refreshToken,
  error,
}: {
  success: boolean;
  refreshToken?: string;
  error?: string;
}) => {
  console.log('ssr success', success);

  useEffect(() => {
    if (refreshToken) localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  }, [refreshToken]);

  return (
    <Container size='xs'>
      <Paper
        withBorder
        p='xl'
        radius='md'
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div
          style={{
            width: '200px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'left',
          }}
        >
          <DisplayState refreshToken={refreshToken ?? null} error={error ?? null} />
        </div>
      </Paper>
    </Container>
  );
};

export default Verifying;
