export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type APIRequestConfig = 'post-json' | 'get';

export interface APIResponseData {
  id: number;
  attributes: Record<string, any>;
  meta: {
    availableLocales?: string[];
  };
}

// Store
export type PaymentType = 'onetime' | 'subscription:monthly' | 'subscription:yearly';

export interface Product {
  id: number;
  name: string;
  payment: {
    price: number;
    type: PaymentType;
    stripe: string;
    paypal: string;
    total?: number;
  };
  features: string[];
}

// Request / Response

export interface DataPayload<T> {
  [key: string]: T;
}

export interface DataResponse<T> {
  data?: T;
  isLoading: boolean;
  isError: any;
}

export interface ResponseData {
  error?: string;
  msg?: string;
}

// Components Props

export interface StatsProps {
  data: {
    label: string;
    stats: string;
    progress: number;
    color: string;
    icon: 'up' | 'down';
  }[];
}

//

// User / Account Creation
export interface Credentials {
  password: string;
  email: string;
}

export interface UserDB {
  id: string;
  username: string;
  email: string;
  password: string;
  created: EpochTimeStamp;
}

export interface RegisterForm {
  email: string;
  password: string;
  terms: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

interface ValidationError<T> {
  message: string;
  path: string | null;
  value: T;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: ValidationError<T>[];
  value: T;
  results: Array<string>;
}

// {
//   'Americas',
//   'Asia',
//   'Africa',
//   'Europe',
//   'Oceania',
//   'Antarctic'
// }
