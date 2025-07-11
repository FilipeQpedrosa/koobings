import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Middleware for query logging and error tracking
prisma.$use(async (params, next) => {
  const startTime = Date.now()
  try {
    const result = await next(params)
    const endTime = Date.now()
    const duration = endTime - startTime

    // Log slow queries in production
    if (process.env.NODE_ENV === 'production' && duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, {
        model: params.model,
        action: params.action,
        duration,
      })
    }

    return result
  } catch (error) {
    throw error
  }
})

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma