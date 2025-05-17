import { Redis } from 'ioredis'
import { env } from './env'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis = globalForRedis.redis || new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      return true
    }
    return false
  }
})

redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

redis.on('connect', () => {
  console.log('Successfully connected to Redis')
})

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

export async function cacheData<T>(
  key: string,
  fetchData: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  try {
    // Try to get data from cache
    const cachedData = await redis.get(key)
    if (cachedData) {
      return JSON.parse(cachedData)
    }

    // If not in cache, fetch and store
    const freshData = await fetchData()
    await redis.setex(key, ttl, JSON.stringify(freshData))
    return freshData
  } catch (error) {
    console.error('Cache operation failed:', error)
    // Fallback to fetching fresh data
    return fetchData()
  }
} 