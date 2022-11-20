import { Prisma } from '@prisma/client/edge';
import log from 'loglevel';

export const formValidators = {
  email: (email: string) => {
    if (!email || email.length < 4) return 'Invalid email';
    return null;
  },
  nickname: (nickname: string) => {
    const invalid = nickname.length < 3 || nickname.length > 24;
    if (invalid) return 'Must be between 3 and 24 characters long';
    else return null;
  },
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
  // The maximum is exclusive and the minimum is inclusive
}

export const emailToNickname = (email: string) => {
  const emailPrefix = email.substring(0, email.indexOf('@'));
  console.log('emailPrefix', emailPrefix);

  // nickname = email with no prefix or numbers
  let nickname = emailPrefix.replace(/\d+/g, '');
  if (nickname.length > 19) nickname = emailPrefix.substring(0, 19);

  const nicknameID = getRandomInt(0, 9999);

  return `${nickname}-${nicknameID}`;
};

interface SuccessResponse {
  success: true;
  message?: string;
  data?: any;
}

interface ErrorResponse {
  error: true;
  message: string;
}

export const sendError = (message: string, status: number) =>
  new Response(JSON.stringify({ error: true, message } as ErrorResponse), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });

export const sendSuccess = (message?: string, data?: any) =>
  new Response(JSON.stringify({ success: true, message, data } as SuccessResponse), {
    status: 201,
    headers: {
      'content-type': 'application/json',
    },
  });

export const handlePrismaError = (
  e: any,
):
  | { isError: true; error: { code: string; message: string; name: string; cause: unknown } }
  | { isError: false; error: null } => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be accessed in a type-safe manner
    const { code, message, name, cause } = e;
    log.error(code, message, name, cause);
    return { isError: true, error: { code, message, name, cause } };
  }
  return { isError: false, error: null };
  throw e;
};

export const handleError = (
  e: any,
  customError: { message: string; code: number } = {
    message: 'Unexpected error. Try again later.',
    code: 400,
  },
) => {
  const { isError, error } = handlePrismaError(e);
  if (isError) {
    if (error.code.startsWith('P1')) return sendError('Try again later...', 500);
    else return sendError(customError.message, customError.code);
  }
  return sendError(customError.message, customError.code);
};

export const timestampFormat = (ts: number) =>
  new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(new Date(ts)) || '-';

export const isPositiveInteger = (str: any) => {
  if (typeof str !== 'string') {
    return false;
  }

  const num = Number(str);

  if (Number.isInteger(num) || num === 0) {
    return true;
  }

  return false;
};
