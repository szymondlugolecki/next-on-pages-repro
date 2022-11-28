const secret = process.env.JWT_SECRET;

if (!secret) throw new Error('No Auth secret was found');

const secretEncoded = new TextEncoder().encode(secret);

export const jwtConfig = {
  alg: 'HS256',
  accessTokenConfig: {
    secret: secretEncoded,
    expirationTime: '2m',
  },
  refreshTokenConfig: {
    secret: secretEncoded,
    expirationTime: '21d',
  },
  audience: 'geopolis.io',
  issuer: 'geopolis-workers',
};
