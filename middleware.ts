/**
 * North Obhur (@Northabhor) Route Guard Middleware
 * Strictly protects /admin and /admin/* routes.
 * Unauthenticated users attempting to access any admin path are redirected to /login.
 * 
 * Supports both Next.js Edge Middleware and Express.js Server Middleware.
 */

import { verifyAdminSession } from './src/lib/supabase/server';

// ============================================================================
// Express.js Server Middleware Guard
// ============================================================================
export async function expressAdminGuard(req: any, res: any, next: any) {
  const urlPath = req.path || req.url || '';

  // Only guard /admin routes and /api/admin/* endpoints
  if (!urlPath.startsWith('/admin') && !urlPath.startsWith('/api/admin')) {
    return next();
  }

  const { isAuthenticated } = await verifyAdminSession(req);

  if (isAuthenticated) {
    return next();
  }

  // If this is an API call, return 401 Unauthorized
  if (urlPath.startsWith('/api/')) {
    return res.status(401).json({
      error: 'غير مصرح لك بالوصول - يجب تسجيل الدخول كمسؤول في منصة أبحر',
      redirectTo: '/login',
    });
  }

  // If this is a page visit to /admin, redirect to /login with redirect query param
  const redirectUrl = `/login?redirect=${encodeURIComponent(urlPath)}`;
  return res.redirect(302, redirectUrl);
}

// ============================================================================
// Next.js Edge Middleware Specification (for Next.js deployments)
// ============================================================================
export async function middleware(request: any) {
  const url = request.nextUrl || new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith('/admin')) {
    const cookies = request.cookies;
    const token = cookies.get('sb-access-token')?.value;
    const role = cookies.get('sb-user-role')?.value;

    const isAuthed = Boolean(token) || role === 'admin';

    if (!isAuthed) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      // In Next.js environments, return NextResponse.redirect(loginUrl)
      if (typeof Response !== 'undefined') {
        return Response.redirect(loginUrl.toString(), 302);
      }
    }
  }

  return;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export default expressAdminGuard;
