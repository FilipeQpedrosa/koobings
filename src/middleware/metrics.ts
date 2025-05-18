import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  httpRequestDurationMicroseconds,
  httpRequestTotal
} from '../app/api/metrics/route';

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

    // Record metrics
    httpRequestTotal.inc({ method, route, status_code: status });
    httpRequestDurationMicroseconds
      .labels(method, route, status.toString())
      .observe(duration / 1000); // Convert to seconds

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    
    // Record error metrics
    httpRequestTotal.inc({ method, route, status_code: 500 });
    httpRequestDurationMicroseconds
      .labels(method, route, '500')
      .observe(duration / 1000);

    throw error;
  }
} 