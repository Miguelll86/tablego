import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Pagine che richiedono autenticazione
  const protectedPages = ['/dashboard', '/menu', '/tables', '/orders', '/reservations', '/settings'];
  const adminPages = ['/admin'];
  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));
  const isAdminPage = adminPages.some(page => pathname.startsWith(page));
  
  // Controlla se l'utente è autenticato (cookie di sessione)
  const sessionToken = request.cookies.get('session_token');
  
  if (isProtectedPage && !sessionToken) {
    // Reindirizza al login se non autenticato
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Se l'utente è già loggato e va su login/register, reindirizza alla dashboard
  if ((pathname === '/login' || pathname === '/register') && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Admin guard minimale: richiede cookie user_role=ADMIN
  if (isAdminPage) {
    const role = request.cookies.get('user_role')?.value;
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/menu/:path*', 
    '/tables/:path*', 
    '/orders/:path*', 
    '/reservations/:path*', 
    '/settings/:path*', 
    '/login', 
    '/register',
    '/admin/:path*'
  ],
}; 