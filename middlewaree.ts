// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { aTCookie } from './lib/server/constants';
// import verifyToken from './lib/server/verifyToken';
// import { JWTPayload } from 'jose';
// import { User } from './types';

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   if (pathname === '/profile/me') {
//     const accessToken = request.cookies.get(aTCookie);
//     if (!accessToken) return NextResponse.next();
//     try {
//       const { payload } = await verifyToken(accessToken);
//       const { user } = payload as JWTPayload & { user: User };

//       return NextResponse.redirect(new URL(`/profile/${user.nickname}`, request.url));
//     } catch (error: any) {
//       if (error.code === 'ERR_JWT_EXPIRED') {
//         console.log('bros token expired');
//         NextResponse.
//         return NextResponse.redirect(new URL('/auth/login', request.url));
//       }
//       return NextResponse.next();
//     }
//   }
//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   runtime: 'experimental-edge',
//   matcher: ['/profile/:path*'],
// };
