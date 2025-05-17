import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { log } from '@/lib/logger'

const logger = log.child({ service: 'health-check' })

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', message: 'Connected' }
  } catch (error) {
    logger.error('Database health check failed', error as Error)
    return { status: 'unhealthy', message: 'Connection failed' }
  }
}

async function checkRedis() {
  try {
    await redis.ping()
    return { status: 'healthy', message: 'Connected' }
  } catch (error) {
    logger.error('Redis health check failed', error as Error)
    return { status: 'unhealthy', message: 'Connection failed' }
  }
}

async function checkMemory() {
  const used = process.memoryUsage()
  const maxHeap = 1024 * 1024 * 1024 // 1GB
  
  if (used.heapUsed > maxHeap) {
    logger.warn('High memory usage detected', { used: used.heapUsed, max: maxHeap })
    return { status: 'warning', message: 'High memory usage' }
  }
  
  return {
    status: 'healthy',
    message: 'Normal',
    details: {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
      rss: Math.round(used.rss / 1024 / 1024) + 'MB'
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  
  try {
    const [dbHealth, redisHealth, memoryHealth] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkMemory()
    ])

    const isHealthy = [dbHealth, redisHealth, memoryHealth]
      .every(check => check.status === 'healthy')

    const response = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbHealth,
        redis: redisHealth,
        memory: memoryHealth
      },
      responseTime: Date.now() - startTime + 'ms'
    }

    logger.info('Health check completed', response)

    return NextResponse.json(
      response,
      { status: isHealthy ? 200 : 503 }
    )
  } catch (error) {
    logger.error('Health check failed', error as Error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
} 