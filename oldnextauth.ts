// import type { NextApiRequest, NextApiResponse } from 'next';
// import NextAuth from 'next-auth';
// import EmailProvider from 'next-auth/providers/email';
// import GoogleProvider from 'next-auth/providers/google';
// import { emailToNickname, handlePrismaError } from '../../../lib/edgeFunctions';

// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import prisma from '../../../lib/prismaClient';

// const aDay = 60 * 60 * 24;

// const auth = async (req: NextApiRequest, res: NextApiResponse) => {
//   const emailOptions = {
//     from: process.env.NO_REPLY_EMAIL,
//     server: {
//       host: process.env.EMAIL_SERVER,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_AUTH_USER,
//         pass: process.env.EMAIL_AUTH_PASS,
//       },
//     },
//   };
//   return NextAuth(req, res, {
//     adapter: PrismaAdapter(prisma),
//     session: {
//       maxAge: aDay * 14, // 14 days
//       strategy: 'jwt',
//     },
//     callbacks: {
//       async jwt({ token, user, isNewUser }) {
//         if (user) {
//           token.user = user;
//         }

//         // First login
//         if (isNewUser === true && user?.email) {
//           // Assign a randomly generated nickname based on user's email
//           try {
//             const genericNickname = emailToNickname(user.email);
//             const userDB = await prisma.user.update({
//               where: {
//                 email: user.email,
//               },
//               data: {
//                 nickname: genericNickname,
//               },
//             });

//             token.user = userDB;
//           } catch (error) {
//             handlePrismaError(error);
//           }
//         }

//         // Session Refresh Request
//         if (req.url === '/api/auth/session?update') {
//           // Fetch the user from the database
//           try {
//             const userDB = await prisma.user.findFirstOrThrow({
//               where: {
//                 email: token.user.email,
//               },
//             });

//             // Update the token
//             token.user = userDB;
//             console.log('Session Update Called', 'Updated User', token.user);
//           } catch (error) {
//             handlePrismaError(error);
//           }
//         }

//         return token;
//       },
//       async session({ session, token }) {
//         if (!session.user) console.log('Catch!', 'User does not exist in session');
//         if (token) {
//           session.user = token.user;
//         }
//         return session;
//       },
//       async signIn({ user, credentials, profile }) {
//         console.log(credentials, profile);
//         console.log('Is allowed to sign in', user.banned);
//         return true;

//         // if (user.banned) return false
//         // return true
//       },
//     },
//     pages: {
//       signIn: '/auth/login',
//       verifyRequest: '/auth/verify',
//       signOut: '/auth/signout',
//       newUser: '/auth/welcome',
//     },
//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID || '',
//         clientSecret: process.env.GOOGLE_SECRET_KEY || '',
//       }),
//       EmailProvider(emailOptions),
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     theme: {
//       colorScheme: 'auto',
//       brandColor: '#25262b', // Hex color code
//       logo: 'favicon.svg', // Absolute URL to image
//       buttonText: '#40c057', // Hex color code
//     },
//     debug: false,
//   });
// };

// export default auth;

// /*

// Type
// '(credentials: Record<"email" | "password", string> | undefined) =>
// Promise<Record<"email" | "password", string> | null | undefined>'

// is not assignable to type
// '(credentials: Record<"email" | "password", string> | undefined,
// req: Pick<RequestInternal, "headers" | "body" | "query" | "method">) =>
// Awaitable<...>'.

// */
