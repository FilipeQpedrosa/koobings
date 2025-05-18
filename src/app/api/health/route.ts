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
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { status: 'healthy', message: 'Service is running' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', message: 'Service is not healthy' },
      { status: 500 }
    );
  }
} 