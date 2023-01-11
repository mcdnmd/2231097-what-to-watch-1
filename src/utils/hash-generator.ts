import crypto from 'crypto';
import * as jose from 'jose';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const createJwtToken = async (algo: string, secret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algo})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(crypto.createSecretKey(secret, 'utf-8'));

