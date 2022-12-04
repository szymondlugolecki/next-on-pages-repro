import { jwtVerify } from 'jose';
import { jwtConfig } from './constants';

const { secret, audience, issuer } = jwtConfig;

const verifyToken = (token: string) => jwtVerify(token, secret, { issuer, audience });

export default verifyToken;
