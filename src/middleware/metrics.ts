import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// TODO: Integrate metrics collection (httpRequestDurationMicroseconds, httpRequestTotal) when available

export async function metricsMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  const start = Date.now();
  const method = request.method;
  const url = new URL(request.url);
  const route = url.pathname;

  try {
    const response = await next();
    const duration = Date.now() - start;
    const status = response.status;

    // TODO: Record metrics here when available

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    
    // TODO: Record error metrics here when available

    throw error;
  }
} 