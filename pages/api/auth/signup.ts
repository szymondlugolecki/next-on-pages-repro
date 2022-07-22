import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import redis from '../../../scripts/redis';
import { validateForm } from '../../../scripts/utils';

import { ResponseData } from '../../../types/Types';

// 'user:ID': { id: '43434434343', email: 'john@gmail.com', nickname: 'johnny123' }
// 'rel:nickname:NICKNAME': '43434434343'
// 'rel:email:EMAIL': '43434434343'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // validate if it is a POST
    if (req.method !== 'POST') {
      return res.status(200).json({ error: 'This API call only accepts POST methods' });
    }

    // get and validate body variables
    let { nickname, email, password } = req.body;

    email = email.toLowerCase();

    const errorMessage = await validateForm(nickname, email, password);
    if (errorMessage) return res.status(400).json(errorMessage as ResponseData);

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create a user
    const id = nanoid();
    const user = { id, nickname, password: hashedPassword, email, created: Date.now() };

    const result = await redis.hset(id, user);
    if (result !== 5) console.log('only', result, 'fields added');

    redis.set(`rel:nickname:${nickname}`, id);
    // .then(console.log).catch(console.error);
    redis.set(`rel:email:${email}`, id);
    // .then(console.log).catch(console.error);

    console.log('user registered', id);

    res.status(200).json({ msg: 'Registered successfully', error: '' });
  } catch (error) {
    console.error(error);
  }
}
