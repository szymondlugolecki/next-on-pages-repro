import { SignJWT } from 'jose';
import { jwtConfig } from './constants';

const {
  refreshTokenConfig: { expirationTime, secret },
  alg,
  audience,
  issuer,
} = jwtConfig;

const createRefreshToken = async (payload: { browserInfo?: string; userId: string }) =>
  new SignJWT({ payload })
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .setIssuer(issuer)
    .setSubject(payload.userId)
    .setAudience(audience)
    .setExpirationTime(expirationTime)
    .sign(secret);

export default createRefreshToken;
