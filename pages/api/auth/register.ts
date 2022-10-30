import type { NextRequest } from 'next/server';
import { getFaunaError, getPasswordRequirements, hashPassword } from '../../../lib/edgeFunctions';
import faunaClient, { q } from '../../../lib/faunaClient';
import type { RegisterForm } from '../../../types/GameplayTypes';

export const config = {
  runtime: 'experimental-edge',
};

const defaultUserObject = () => ({
  nickname: null,
  provider: 'credentials',
  confirmed: false,
  banned: false,
  ts: Date.now(),
  ducats: 0,
  photo: null,
  vip: false,
});

const createUser = ({ email, password }: Omit<RegisterForm, 'terms'>) =>
  faunaClient.query(
    q.Let(
      {
        userExists: q.Exists(q.Match(q.Index('user_by_email'), email)),
      },
      q.If(
        q.Not(q.Var('userExists')),
        q.Create(q.Collection('users'), {
          data: { email, password: hashPassword(password), ...defaultUserObject() },
        }),
        q.Get(q.Match(q.Index('user_by_email'), email)),
      ),
    ),
  );

export default async function handler(req: NextRequest) {
  try {
    const data: RegisterForm = await req.json();
    const { email, password, terms } = data;

    if (!email || !password || terms !== true)
      return new Response('Invalid credentials', { status: 401 });

    const passwordValid = getPasswordRequirements(password).every((r) => r.meets === true);
    if (!passwordValid) return new Response('Invalid password', { status: 401 });

    const emailValid = email.includes('@') && email.length > 4;
    if (!emailValid) return new Response('Invalid email', { status: 401 });

    const authData = { email: email.toLowerCase(), password };

    console.log(authData);

    const result = await createUser({ ...authData });
    console.log('result', result);

    return new Response(
      JSON.stringify({
        response: 'Your account has been successfully created',
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  } catch (error) {
    const result = getFaunaError(error);
    console.log(result);
  }
}
