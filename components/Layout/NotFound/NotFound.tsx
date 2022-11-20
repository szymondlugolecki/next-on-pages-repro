import { Group, Image, Stack, Text, Title, useMantineTheme } from '@mantine/core';

export default function NotFound() {
  const theme = useMantineTheme();
  return (
    <Group
      position='center'
      spacing={theme.spacing.xl * 2}
      sx={(themeX) => ({ background: themeX.colors.red[0], borderRadius: themeX.radius.xl * 2 })}
    >
      <Stack align='flex-start'>
        <Title order={1} color='dark'>
          Oops! Not found
        </Title>
        <Text size='lg' color='dark' weight={600}>
          Make sure the data you provided is valid
        </Text>
      </Stack>
      <Image
        src='/problem.svg'
        fit='contain'
        width={300}
        height={300}
        alt='Illustration showing a person that has a problem with their computer'
        sx={() => ({ borderRadius: '50px' })}
      />
    </Group>
  );
}
