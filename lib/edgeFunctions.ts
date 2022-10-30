import { pbkdf2 } from 'fast-sha256';

export const hashPassword = (pass: string) => {
  console.log('started hashing', pass);
  const password = new TextEncoder().encode(pass);
  console.log('password', password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  console.log('salt', salt);
  const hash = pbkdf2(password, salt, 1000, 48);
  console.log('hash', hash);
  const hashedPassword = new TextDecoder().decode(hash);

  console.log('hashedPassword', hashedPassword);

  return hashedPassword;
};

export const getPasswordRequirements = (password: string) => [
  {
    label: 'Between 6 and 24 characters long',
    meets: /.{6,24}/.test(password),
  },
  {
    label: 'At least one lowercase letter',
    meets: /(?=.*[a-z])/.test(password),
  },
  {
    label: 'At least one uppercase letter',
    meets: /(?=.*[A-Z])/.test(password),
  },
  {
    label: 'At least one digit',
    meets: /(?=.*[0-9])/.test(password),
  },
  {
    label: 'At least one special character',
    meets: /(?=.*\W)/.test(password),
  },
];

export const authValidators = {
  email: (email: string) => {
    if (!email || email.length < 4) return 'Invalid email';
    return null;
  },
  password: (password: string) => {
    const correct = getPasswordRequirements(password).every((r) => r.meets);
    if (!correct) return 'Invalid password';
    return null;
  },
};

export const getFaunaError = (error: any) => {
  const { code, description } = error.requestResult.responseContent.errors[0];
  let status;

  switch (code) {
    case 'unauthorized':
    case 'authentication failed':
      status = 401;
      break;
    case 'permission denied':
      status = 403;
      break;
    case 'instance not found':
      status = 404;
      break;
    case 'instance not unique':
    case 'contended transaction':
      status = 409;
      break;
    default:
      status = 500;
  }

  return { code, description, status };
};
