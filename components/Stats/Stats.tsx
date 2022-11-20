import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
import { ArrowDownRight, ArrowUpRight } from 'tabler-icons-react';

// xD
import { StatsProps } from '../../types/GameplayTypes';

const icons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
};

export function Stats({ data }: StatsProps) {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius='md' p='xs' key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={22} />
              </Center>
            }
          />

          <div>
            <Text color='dimmed' size='xs' transform='uppercase' weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size='xl'>
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });
  return (
    <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt={30}>
      {stats}
    </SimpleGrid>
  );
}
