const secret = process.env.JWT_SECRET;

if (!secret) throw new Error('No Auth secret was found');

const secretEncoded = new TextEncoder().encode(secret);

// Access Token Cookie Max-Age
export const aTMaxAge = 1000 * 60 * 2; // 2 minutes

export const jwtConfig = {
  alg: 'HS256',
  secret: secretEncoded,
  accessTokenConfig: {
    expirationTime: '2m',
  },
  refreshTokenConfig: {
    expirationTime: '21d',
  },
  audience: 'geopolis.io',
  issuer: 'geopolis-workers',
};

export const aTCookie = 'access-token';
