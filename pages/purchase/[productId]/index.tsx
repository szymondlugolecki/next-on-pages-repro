// Hooks
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import { Button, Divider, Group, Paper, Space, Table, Text, Title } from '@mantine/core';
import { BrandPaypal, BrandStripe } from 'tabler-icons-react';
import Loading from '../../../components/Layout/Loading';
import NotFound from '../../../components/Layout/NotFound';
import { isPositiveInteger } from '../../../lib/edgeFunctions';

// Types
import Link from 'next/link';
import Ducat from '../../../components/Ducat';
import { ducatsShop } from '../../../lib/constants';

export default function DucatsPurchase() {
  const { push, query } = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/auth/login');
    },
  });

  const { productId } = query;
  if (status === 'loading') return <Loading />;
  if (!productId || !isPositiveInteger(productId) || typeof productId !== 'string')
    return <NotFound />;

  const product = ducatsShop.find(({ id }) => id == Number(productId));
  if (!product) return <NotFound />;

  const { id, amount, price, links } = product;

  const rows = [product].map(() => (
    <tr key={id}>
      <td>{id}</td>
      <td>
        <Group spacing={3}>
          <Text weight={500}>Ducats</Text>
          <Ducat />
        </Group>
      </td>

      <td>
        <Text>{amount}</Text>
      </td>
      <td>
        <Text>${price}.00</Text>
      </td>
    </tr>
  ));

  return (
    <Paper withBorder p='lg'>
      <Title order={1} mb='md'>
        🛒 Checkout
      </Title>
      <Paper withBorder p='md'>
        <Table fontSize='lg'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Space h='md' />
      </Paper>
      <Group position='right' px='xs' mt='md'>
        <Title order={4}>Total ${price}.00</Title>
      </Group>
      <Divider my='md' />
      <Group position='right'>
        <Link href={links.stripe}>
          <Button color='indigo' leftIcon={<BrandStripe />} variant='outline' size='md'>
            Stripe
          </Button>
        </Link>
        <Link href={links.paypal}>
          <Button color='yellow' leftIcon={<BrandPaypal />} variant='outline' size='md'>
            Paypal
          </Button>
        </Link>
      </Group>
    </Paper>
  );
}
