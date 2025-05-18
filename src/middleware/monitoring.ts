import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import { RedisClient } from '@/lib/redis'

interface MetricsData {
  requestCount: number
  errorCount: number
  averageResponseTime: number
  responseTimeSum: number
  statusCodes: Record<number, number>
}

const METRICS_KEY = 'api:metrics'
const METRICS_WINDOW = 300 // 5 minutes

export async function withMonitoring(request: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  // Add request tracking headers
  const headers = new Headers(request.headers)
  headers.set('X-Request-ID', requestId)

  try {
    // Execute request
    const response = await NextResponse.next({
      request: {
        headers,
      },
    })

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Update metrics
    await updateMetrics({
      responseTime,
      statusCode: response.status,
      isError: response.status >= 400,
    })

    // Add monitoring headers
    response.headers.set('X-Response-Time', `${responseTime}ms`)
    response.headers.set('X-Request-ID', requestId)

    // Log request details
    logger.info('API Request', {
      requestId,
      method: request.method,
      url: request.url,
      status: response.status,
      responseTime,
      userAgent: request.headers.get('user-agent'),
    })

    return response
  } catch (error) {
    // Log error
    logger.error('API Error', {
      requestId,
      error,
      method: request.method,
      url: request.url,
    })

    // Update error metrics
    await updateMetrics({
      responseTime: Date.now() - startTime,
      statusCode: 500,
      isError: true,
    })

    // Return error response
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'X-Request-ID': requestId,
      },
    })
  }
}

async function updateMetrics({
  responseTime,
  statusCode,
  isError,
}: {
  responseTime: number
  statusCode: number
  isError: boolean
}) {
  try {
    const client = await RedisClient.getInstance()
    const currentMetrics = await RedisClient.get<MetricsData>(METRICS_KEY) || {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      responseTimeSum: 0,
      statusCodes: {},
    }

    // Update metrics
    currentMetrics.requestCount++
    if (isError) currentMetrics.errorCount++
    currentMetrics.responseTimeSum += responseTime
    currentMetrics.averageResponseTime =
      currentMetrics.responseTimeSum / currentMetrics.requestCount
    currentMetrics.statusCodes[statusCode] =
      (currentMetrics.statusCodes[statusCode] || 0) + 1

    // Store updated metrics
    await RedisClient.set(METRICS_KEY, currentMetrics, METRICS_WINDOW)
  } catch (error) {
    logger.error('Error updating metrics', { error })
  }
}

// Helper to get current metrics
export async function getMetrics(): Promise<MetricsData | null> {
  try {
    return await RedisClient.get<MetricsData>(METRICS_KEY)
  } catch (error) {
    logger.error('Error fetching metrics', { error })
    return null
  }
}

// Helper to reset metrics
export async function resetMetrics(): Promise<void> {
  try {
    await RedisClient.del(METRICS_KEY)
    logger.info('Metrics reset')
  } catch (error) {
    logger.error('Error resetting metrics', { error })
  }
} 