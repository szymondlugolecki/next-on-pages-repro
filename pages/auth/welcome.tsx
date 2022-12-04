import { Container, Paper, Title } from '@mantine/core';
// import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '../../components/Layout/Loading';
import { useAuth } from '../../lib/swrClient';

export default function Welcome() {
  const { push } = useRouter();
  const { useSession } = useAuth();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated' && push) push('/auth/login');
  }, [status, push]);

  if (status === 'loading') return <Loading />;

  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <Title color='green.4' order={1}>
          Welcome to geopolis.io
        </Title>
      </Paper>
    </Container>
  );
}
