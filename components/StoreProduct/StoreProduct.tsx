import React, { SetStateAction, useState } from 'react';
import Link from 'next/link';
import {
  Group,
  Text,
  Box,
  Button,
  Stack,
  Center,
  Collapse,
  Paper,
  Badge,
  Indicator,
  Anchor,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { CreditCard } from 'tabler-icons-react';
import { BrandPaypal } from 'tabler-icons-react';

import type { Product } from '../../types/GameplayTypes';

import styles from '../../pages/Store.styles';

// {
//     id: 0,
//     name: 'VIP',
//     payment: {
//       price: 3.99,
//       type: 'subscription:monthly',
//     },
//     features: VIPFeatures,
//   },

export function StoreProduct({ product: { id, name, payment, features } }: { product: Product }) {
  const [paymentOptsShown, showPaymentOpts] = useToggle([false, true]);
  const { classes } = styles();

  const subscription = payment.type.startsWith('subscription');
  const subTimespan = subscription ? payment.type.split(':')[1] : null;

  const paymentOptions = (
    <Group grow>
      <Button leftIcon={<CreditCard />} color="indigo" component="a" href={payment.stripe}>
        Credit Card
      </Button>

      <Button leftIcon={<BrandPaypal />} color="blue" component="a" href={payment.paypal}>
        PayPal
      </Button>
    </Group>
  );

  return (
    <Stack className={classes.product} py="lg" px="xl" spacing="sm" justify="space-between">
      <Stack spacing={0} align="center" my="sm">
        <Text size={32} weight={600}>
          {name}
        </Text>
        <Stack spacing={1} align="center" my={0}>
          <Text size={56} weight="bold">
            ${payment.price}
          </Text>
          {subscription && <Text>per month billed {subTimespan}</Text>}
          {!subscription && <Text>one-time payment</Text>}
        </Stack>
      </Stack>

      {paymentOptsShown ? (
        paymentOptions
      ) : (
        <Button fullWidth variant="light" onClick={() => showPaymentOpts()}>
          Buy
        </Button>
      )}
    </Stack>
  );
}
