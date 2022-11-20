import { Product } from '../../types/GameplayTypes';

export const ducatsShop = [
  {
    id: 0,
    price: 5,
    amount: 1000,
    bonus: null,
    links: {
      stripe: 'https://buy.stripe.com/test_9AQ4kk3aa0QdgGQaEK',
      paypal: '',
    },
  },
  {
    id: 1,
    price: 10,
    amount: 2225,
    bonus: 225,
    links: {
      stripe: 'https://buy.stripe.com/test_3csaII8uueH362ceV2',
      paypal: '',
    },
  },
  {
    id: 2,
    price: 25,
    amount: 6875,
    bonus: 1875,
    links: {
      stripe: 'https://buy.stripe.com/test_3cs3gg6mmgPbeyIaEL',
      paypal: '',
    },
  },
  {
    id: 3,
    price: 50,
    amount: 15000,
    bonus: 5000,
    links: {
      stripe: 'https://buy.stripe.com/test_bIYcQQdOOcyVaisdQV',
      paypal: '',
    },
  },
];

const VIPFeatures = [
  'X2 XP Multiplier',
  'Access to USA States gamemode',
  'Access to Country Shapes gamemode',
  'VIP Badge',
  'Access to in-depth stats',
  'One free color name change/day',
  'One free name change/day',
  'No ads',
];

export const storeProducts: Product[] = [
  {
    id: 2,
    name: 'Name Change',
    payment: {
      price: 0.99,
      type: 'onetime',
      stripe: 'https://buy.stripe.com/test_14k4kk9yy42pfCM145',
      paypal: '',
    },
    features: ['You can change your name once'],
  },
  {
    id: 4,
    name: 'Stats Reset',
    payment: {
      price: 1.99,
      type: 'onetime',
      stripe: 'https://buy.stripe.com/test_cN29EEdOO56tgGQ148',
      paypal: '',
    },
    features: ['You can reset your stats once'],
  },
  {
    id: 0,
    name: 'VIP',
    payment: {
      price: 3.99,
      type: 'subscription:monthly',
      stripe: 'https://buy.stripe.com/test_6oEdUU7qqeH30HS5kk',
      paypal: '',
    },
    features: VIPFeatures,
  },
  {
    id: 1,
    name: 'VIP',
    payment: {
      price: 2.99,
      type: 'subscription:yearly',
      total: 36,
      stripe: 'https://buy.stripe.com/test_14k3gg7qq7eBbmw003',
      paypal: '',
    },
    features: VIPFeatures,
  },
];
