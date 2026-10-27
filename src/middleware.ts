import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isDashboardRoute || isAdminRoute) {
    // 1. Chưa đăng nhập: chuyển hướng về /login với tham số callbackUrl
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(`${pathname}${search}`);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // 2. Đã đăng nhập nhưng không phải admin mà truy cập /admin: chuyển hướng /403
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
