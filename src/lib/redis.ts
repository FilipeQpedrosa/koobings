import Redis from 'ioredis'
import { logger } from './logger'
import { cacheHitTotal, cacheMissTotal } from '../app/api/metrics/route'

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3,
}

const redisClient = new Redis(redisConfig)

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redisClient.on('connect', () => {
  console.log('Redis Client Connected')
})

export class RedisClient {
  private static instance: Redis
  private static isConnecting: boolean = false

  private constructor() {}

  public static async getInstance(): Promise<Redis> {
    if (!RedisClient.instance && !RedisClient.isConnecting) {
      RedisClient.isConnecting = true
      try {
        const client = new Redis(redisConfig)

        // Connection events
        client.on('connect', () => {
          logger.info('Redis client connected')
        })

        client.on('error', (error) => {
          logger.error('Redis client error:', error)
        })

        client.on('close', () => {
          logger.warn('Redis connection closed')
        })

        // Wait for ready event
        await new Promise((resolve) => {
          client.once('ready', resolve)
        })

        RedisClient.instance = client
      } catch (error) {
        logger.error('Failed to create Redis client:', error)
        throw error
      } finally {
        RedisClient.isConnecting = false
      }
    }

    return RedisClient.instance
  }

  // Cache methods
  public static async get<T>(key: string): Promise<T | null> {
    try {
      const client = await RedisClient.getInstance()
      const value = await client.get(key)
      if (value) {
        cacheHitTotal.inc({ cache_type: 'redis' })
        return JSON.parse(value)
      }
      cacheMissTotal.inc({ cache_type: 'redis' })
      return null
    } catch (error) {
      logger.error('Redis get error:', error)
      return null
    }
  }

  public static async set(
    key: string,
    value: any,
    expireSeconds?: number
  ): Promise<void> {
    try {
      const client = await RedisClient.getInstance()
      const stringValue = JSON.stringify(value)
      
      if (expireSeconds) {
        await client.setex(key, expireSeconds, stringValue)
      } else {
        await client.set(key, stringValue)
      }
    } catch (error) {
      logger.error('Redis set error:', error)
    }
  }

  public static async del(key: string): Promise<void> {
    try {
      const client = await RedisClient.getInstance()
      await client.del(key)
    } catch (error) {
      logger.error('Redis del error:', error)
    }
  }

  // Session methods
  public static async getSession(sessionId: string): Promise<any> {
    return RedisClient.get(`session:${sessionId}`)
  }

  public static async setSession(
    sessionId: string,
    data: any,
    expireSeconds: number = 86400 // 24 hours
  ): Promise<void> {
    await RedisClient.set(`session:${sessionId}`, data, expireSeconds)
  }

  // Rate limiting methods
  public static async checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<boolean> {
    const client = await RedisClient.getInstance()
    const current = await client.incr(key)
    
    if (current === 1) {
      await client.expire(key, windowSeconds)
    }
    
    return current <= limit
  }
}

export async function cacheData<T>(
  key: string,
  fetchData: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  try {
    // Try to get data from cache
    const cachedData = await RedisClient.get<T>(key)
    if (cachedData) {
      return cachedData
    }

    // If not in cache, fetch and store
    const freshData = await fetchData()
    await RedisClient.set(key, freshData, ttl)
    return freshData
  } catch (error) {
    console.error('Cache operation failed:', error)
    // Fallback to fetching fresh data
    return fetchData()
  }
}

export default redisClient 