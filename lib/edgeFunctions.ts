import { Prisma } from '@prisma/client/edge';
import log from 'loglevel';
import { ErrorResponse, SuccessResponse } from '../types/API';
import UAParser from 'ua-parser-js';
import { PrivateUser, User } from '../types';

export const privateUserParser = ({
  email,
  nickname,
  avatar,
  ducats,
  createdAt,
  vip,
  banned,
  nameChanges,
}: User): PrivateUser => ({ email, nickname, avatar, ducats, createdAt, vip, banned, nameChanges });

export function shuffle<T>(array: T[]): T[] {
  const tempArray = [...array];
  for (let i = tempArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray;
}

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

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
  // The maximum is exclusive and the minimum is inclusive
};

export const randomElement = <T>(arr: T[]): [T, number] => {
  const rIndex = getRandomInt(0, arr.length);
  return [arr[rIndex], rIndex];
};

export const emailToNickname = (email: string) => {
  const emailPrefix = email.substring(0, email.indexOf('@'));
  console.log('emailPrefix', emailPrefix);

  // nickname = email with no prefix or numbers
  let nickname = emailPrefix.replace(/\d+/g, '');
  if (nickname.length > 19) nickname = emailPrefix.substring(0, 19);

  const nicknameID = getRandomInt(0, 9999);

  return `${nickname}-${nicknameID}`;
};

export const sendError = ({ message, code = 400, error = true }: ErrorResponse) =>
  new Response(JSON.stringify({ error, message } as ErrorResponse), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const sendSuccess = <T>({ message, data, code = 200, success }: SuccessResponse<T>) =>
  new Response(JSON.stringify({ success, message, data } as SuccessResponse), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const extractBrowserInfo = (userAgentHeader: string | null): string => {
  // https://github.com/faisalman/ua-parser-js
  if (userAgentHeader) {
    const parser = new UAParser(userAgentHeader);
    console.log('UA', 'Browser', parser.getBrowser(), 'OS', parser.getOS());
    const browserInfo = [parser.getBrowser().name, parser.getOS().name]
      .filter((el) => el)
      .join('+');
    console.log('UA', 'browserInfo', browserInfo);
    return browserInfo;
  } else return '';
  // `${req.headers.get('user-agent') || req.ip} ${req.headers.get('accept-language')}`
  //   .replace(/null/g, '')
  //   .trim() || '';
};

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
    if (error.code.startsWith('P1')) return sendError({ message: 'Try again later...', code: 500 });
    else return sendError({ message: customError.message, code: customError.code });
  }
  return sendError({ message: customError.message, code: customError.code });
};

export const timestampFormat = (date: Date) =>
  new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(date) || '-';

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
