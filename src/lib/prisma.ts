import { PrismaClient } from '@prisma/client'
import { env } from './env'
import { Sentry } from './sentry'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  },
  connectionLimit: env.DB_POOL_SIZE,
  connectTimeout: env.DB_CONNECT_TIMEOUT
})

// Middleware for query logging and error tracking
prisma.$use(async (params, next) => {
  const startTime = Date.now()
  try {
    const result = await next(params)
    const endTime = Date.now()
    const duration = endTime - startTime

    // Log slow queries in production
    if (env.NODE_ENV === 'production' && duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, {
        model: params.model,
        action: params.action,
        duration,
      })
    }

    return result
  } catch (error) {
    // Track database errors in Sentry
    if (env.SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: {
          model: params.model,
          action: params.action,
          args: params.args,
        },
      })
    }
    throw error
  }
})

// Connection management
prisma.$on('beforeExit', async () => {
  console.log('Shutting down Prisma Client...')
})

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma