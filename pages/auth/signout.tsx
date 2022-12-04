import { Button, Container, Group, Paper, Title } from '@mantine/core';
// import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '../../components/Layout/Loading';
import { useAuth } from '../../lib/swrClient';

export default function Verify() {
  const { push } = useRouter();
  const { useSession, signOut } = useAuth();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated' && push) push('/auth/login');
  }, [status, push]);

  if (status === 'loading') return <Loading />;

  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <Title align='center' order={2}>
          Are you sure you want to sign out?
        </Title>
        <Group spacing='xl' grow>
          <Link href='/play'>
            <Button color='blue' mt='md'>
              No, go back
            </Button>
          </Link>
          <Button onClick={() => signOut()} color='red' mt='md'>
            Yes, sign me out
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
