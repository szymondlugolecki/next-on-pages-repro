// Hooks

// Components
import type { BadgeVariant, DefaultMantineColor, MantineGradient } from '@mantine/core';
import { Badge, Button, Container, Grid, Group, List, Paper, Text, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Loading from '../../components/Layout/Loading';
// import { StoreProduct } from '../components/StoreProduct/StoreProduct';
import Ducat from '../../components/Ducat';

// Types

// Styles
import styles from './Purchase.styles';

// Client-Side Constants & Functions
import Link from 'next/link';
import { ducatsShop } from '../../lib/constants';

export default function PurchasePage() {
  const { classes } = styles();
  const { status } = useSession();

  if (status === 'loading') return <Loading />;

  const BonusBadge = ({ bonus }: { bonus: number | null }) => {
    const BadgeContent = () => (
      <Text sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Bonus: {bonus}
        {''}
        <Ducat size={19} />
      </Text>
    );
    //   <Text>Regular</Text>;

    if (!bonus) return null;

    const color = (): {
      color?: DefaultMantineColor;
      variant?: BadgeVariant;
      gradient?: MantineGradient;
    } => {
      //   if (!bonus) return { color: 'gray' };
      if (bonus === 225) return { variant: 'gradient', gradient: { from: 'gray', to: 'indigo' } };
      if (bonus === 1875) return { variant: 'gradient', gradient: { from: 'indigo', to: 'blue' } };
      if (bonus >= 5000) return { variant: 'gradient', gradient: { from: 'orange', to: 'red' } };
      return {};
    };

    return (
      <Badge
        variant='filled'
        sx={() => ({ position: 'absolute', top: '5px', right: '5px' })}
        size='lg'
        {...color()}
      >
        <BadgeContent />
      </Badge>
    );
  };

  return (
    <Container className={classes.inner}>
      <Grid grow gutter='xl' columns={2}>
        {ducatsShop.map(({ id, price, amount, bonus }) => (
          <Grid.Col span={1} key={id} sx={() => ({ position: 'relative' })}>
            <Paper withBorder shadow='sm' radius='md' p='md' component='a'>
              <Title order={1} align='center'>
                {amount}
                {''}
                <Ducat />
              </Title>
              <Title align='center' order={3} color='green.4'>
                ${price}.00
              </Title>
              <Group grow mt='xl'>
                <Link href={`/purchase/${id}`}>
                  <Button variant='light' color='indigo'>
                    Buy now
                  </Button>
                </Link>
              </Group>
            </Paper>
            <BonusBadge bonus={bonus} />
          </Grid.Col>
        ))}
        <Grid.Col span={2}>
          <Paper withBorder py='sm' radius='md'>
            <List withPadding>
              {/* listStyleType='none' */}
              <List.Item>
                {/* 📌 */}
                Available Payment Methods: Credit Card, Apple Pay, Google Pay, Paypal, BLIK and
                more!
              </List.Item>
              <List.Item>
                <Text sx={{ display: 'flex' }}>
                  {/* 📌 */}
                  The shown amount of Ducats
                  {<Ducat addMargin={true} />}
                  already includes the bonus
                </Text>
              </List.Item>
            </List>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
