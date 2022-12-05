import { SignJWT } from 'jose';
import { aTCookie, aTMaxAge, jwtConfig } from './constants';
import type { User } from '../../types';

const { refreshTokenConfig, accessTokenConfig, alg, audience, issuer, secret } = jwtConfig;

const createRefreshToken = (payload: { browserInfo?: string; userId: string }) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .setIssuer(issuer)
    .setSubject(payload.userId)
    .setAudience(audience)
    .setExpirationTime(refreshTokenConfig.expirationTime)
    .sign(secret);

const createAccessToken = (payload: { browserInfo?: string; user: User }) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .setIssuer(issuer)
    .setSubject(payload.user.id)
    .setAudience(audience)
    .setExpirationTime(accessTokenConfig.expirationTime)
    .sign(secret);

const createATCookie = (accessToken: string) =>
  `${aTCookie}=${accessToken}; Max-Age=${aTMaxAge}; HttpOnly;${
    process.env.NODE_ENV === 'production' ? 'Secure;' : ''
  } SameSite=Lax; Path=/`;

export { createRefreshToken, createAccessToken, createATCookie };
