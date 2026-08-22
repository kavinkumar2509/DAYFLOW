import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Frontend Route Protection Middleware
 * 
 * Rules:
 * 1. Unauthenticated users -> redirected to /login when attempting protected routes (/employee/*, /admin/*)
 * 2. EMPLOYEE role -> redirected to /employee/dashboard if trying to access /admin/*
 * 3. ADMIN / HR roles -> redirected to /admin/dashboard if trying to access /employee/*
 * 4. Authenticated users -> redirected to their respective dashboard from /login
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token and user role from cookie or auth headers
  // (Placeholder structure ready for backend cookie / JWT integration)
  const token = request.cookies.get('token')?.value || request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user_role')?.value; // 'EMPLOYEE' | 'ADMIN' | 'HR'

  const isAuthRoute = pathname === '/login';
  const isEmployeeRoute = pathname.startsWith('/employee');
  const isAdminRoute = pathname.startsWith('/admin');

  // Case 1: Unauthenticated user accessing protected routes
  if (!token && (isEmployeeRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated user visiting /login
  if (token && isAuthRoute) {
    if (role === 'ADMIN' || role === 'HR') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/employee/dashboard', request.url));
  }

  // Case 3: Role-based boundary enforcement
  if (token && role) {
    // Employee attempting to access Admin routes
    if (role === 'EMPLOYEE' && isAdminRoute) {
      return NextResponse.redirect(new URL('/employee/dashboard', request.url));
    }

    // Admin/HR attempting to access Employee routes
    if ((role === 'ADMIN' || role === 'HR') && isEmployeeRoute) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/employee/:path*',
    '/admin/:path*',
  ],
};
