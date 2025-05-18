import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RedisClient } from '@/lib/redis'
import { getMetrics } from '@/middleware/monitoring'
import { logger } from '@/lib/logger'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: {
      status: 'up' | 'down'
      latency: number
    }
    redis: {
      status: 'up' | 'down'
      latency: number
    }
  }
  metrics?: {
    requestCount: number
    errorCount: number
    averageResponseTime: number
    statusCodes: Record<number, number>
  }
}

export async function GET() {
  const startTime = Date.now()
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    services: {
      database: {
        status: 'down',
        latency: 0
      },
      redis: {
        status: 'down',
        latency: 0
      }
    }
  }

  try {
    // Check database
    const dbStartTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    healthStatus.services.database = {
      status: 'up',
      latency: Date.now() - dbStartTime
    }
  } catch (error) {
    logger.error('Database health check failed', { error })
    healthStatus.status = 'degraded'
  }

  try {
    // Check Redis
    const redisStartTime = Date.now()
    const client = await RedisClient.getInstance()
    await client.ping()
    healthStatus.services.redis = {
      status: 'up',
      latency: Date.now() - redisStartTime
    }
  } catch (error) {
    logger.error('Redis health check failed', { error })
    healthStatus.status = 'degraded'
  }

  try {
    // Get metrics
    const metrics = await getMetrics()
    if (metrics) {
      healthStatus.metrics = {
        requestCount: metrics.requestCount,
        errorCount: metrics.errorCount,
        averageResponseTime: Math.round(metrics.averageResponseTime),
        statusCodes: metrics.statusCodes
      }
    }
  } catch (error) {
    logger.error('Metrics retrieval failed', { error })
  }

  // If all services are down, mark as unhealthy
  if (
    healthStatus.services.database.status === 'down' &&
    healthStatus.services.redis.status === 'down'
  ) {
    healthStatus.status = 'unhealthy'
  }

  // Add response time header
  const headers = new Headers()
  headers.set('X-Response-Time', `${Date.now() - startTime}ms`)

  return NextResponse.json(healthStatus, {
    status: healthStatus.status === 'unhealthy' ? 503 : 200,
    headers
  })
} 