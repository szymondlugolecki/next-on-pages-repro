import { SignJWT } from 'jose';
import { jwtConfig } from './constants';
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

export { createRefreshToken, createAccessToken };
