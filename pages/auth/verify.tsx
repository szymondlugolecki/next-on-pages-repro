import { Container, Paper, Title } from '@mantine/core';

export default function Verify() {
  return (
    <Container size='xs'>
      <Paper withBorder p='xl' radius='md'>
        <Title color='green.4' order={1}>
          Success!
        </Title>
        <Title order={5}>A sign in link has been sent to your email address</Title>
      </Paper>
    </Container>
  );
}
