import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  // Remove port for local dev
  const [hostname] = host.split(':');
  // e.g., pipoman.koobings.com
  const parts = hostname.split('.');

  // Adjust for local dev (e.g., pipoman.lvh.me, pipoman.127.0.0.1.nip.io)
  let subdomain = '';
  if (parts.length > 2) {
    subdomain = parts[0];
  }

  // Ignore root, www, or app subdomains
  if (!subdomain || ['www', 'app', 'localhost', '127'].includes(subdomain)) {
    return NextResponse.next();
  }

  // Inject subdomain as x-business header
  const response = NextResponse.next();
  response.headers.set('x-business', subdomain);
  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files, Next.js internals, auth routes, and init route
    '/((?!_next|static|favicon.ico|api/auth|api/init|setup-database).*)',
  ],
}; 