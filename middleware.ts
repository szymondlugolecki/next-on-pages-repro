// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const authorizedOnlyRoutes = ['/settings'];

export default withAuth(function middleware(req) {
  console.log('middleware', req.nextUrl.pathname);
  const { token } = req.nextauth;

  // Redirect to my profile
  if (req.nextUrl.pathname === '/profile/me') {
    if (token?.user?.nickname) {
      return NextResponse.redirect(new URL(`/profile/${token.user.nickname}`, req.url));
    }
  }

  // Authorized-Only Routes
  if (authorizedOnlyRoutes.includes(req.nextUrl.pathname)) {
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url));
  }
});

export const config = {
  matcher: ['/profile/me', '/settings'],
};

// import { withAuth } from 'next-auth/middleware';

// import { NextResponse } from 'next/server';

// export default withAuth(
//   function middleware(request) {
//     console.log(request.nextauth.token);
//     const postRequest = request.method === 'POST';
//     if (postRequest && request.nextUrl.pathname.startsWith('/api/nickname/update')) {
//       return NextResponse.rewrite(new URL('/about-2', request.url));
//     }

//     if (request.nextUrl.pathname.startsWith('/dashboard')) {
//       return NextResponse.rewrite(new URL('/dashboard/user', request.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === 'admin',
//     },
//   },
// );

// export const config = { matcher: ['/api/nickname/available'] };
