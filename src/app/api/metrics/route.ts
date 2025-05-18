import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

// Initialize metrics
collectDefaultMetrics();

// Custom metrics
export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const cacheHitTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type']
});

export const cacheMissTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type']
});

export const bookingRequestsTotal = new Counter({
  name: 'booking_requests_total',
  help: 'Total number of booking requests',
  labelNames: ['status']
});

export const activeUsersGauge = new Counter({
  name: 'active_users',
  help: 'Number of active users',
  labelNames: ['user_type']
});

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType
      }
    });
  } catch (err) {
    console.error('Error generating metrics:', err);
    return new NextResponse('Error generating metrics', { status: 500 });
  }
} 