import redis from '../scripts/redis';

export const validateForm = async (username: string, email: string, password: string) => {
  // password: too short/too long
  if (password.length < 6 || password.length >= 32)
    return { error: 'Password must be above 5 and below 32 characters' };

  // + username: too short/too long
  if (username.length < 4 || username.length >= 32)
    return { error: 'Username must be above 4 and below 32 characters' };

  // + invalid email | pureEmail - email without the domain
  const pureEmail = email.split('@')[0];
  if (pureEmail.length > 64 || email.length > 320 || !validateEmail(email))
    return { error: 'Invalid email' };

  console.log('pureEmail', pureEmail);

  // valid data, check if user already exists

  // check if relation id-email exists, if so return an error
  const userIDByEmail = await redis.get(`rel:email:${email}`);
  if (userIDByEmail) return { error: 'Account with this email already exists' };

  // check if relation id-nickname exists, if so return an error
  const userIDByNickname = await redis.get(`rel:nickname:${email}`);
  if (userIDByNickname) return { error: 'Account with this nickname already exists' };

  return null;
};

export const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

// export class Cypher {
//   private readonly algorithm = 'aes256';
//   private readonly key = process.env.CYPHER_KEY;
//   private readonly iv = process.env.CYPHER_IV;

//   encrypt(text: string) {
//     // @ts-ignore
//     const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
//     const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
//     console.log('encrypted', text, '=>', encrypted);
//   }

//   decrypt(text: string) {
//     // @ts-ignore
//     const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
//     const decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
//     console.log('decrypted', text, '=>', decrypted);
//   }
// }
