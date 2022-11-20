import { Container, Paper, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '../../components/Layout/Loading';

export default function Welcome() {
  const { push } = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/auth/login');
    },
  });

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
