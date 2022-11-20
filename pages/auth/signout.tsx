import { Button, Container, Group, Paper, Title } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loading from '../../components/Layout/Loading';

export default function Verify() {
  const { push } = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/home');
    },
  });
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
