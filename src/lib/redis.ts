import Redis from 'ioredis'
import { logger } from './logger'
import { cacheHitTotal, cacheMissTotal } from '@/lib/metrics'

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
  // Disable Redis during build time
  lazyConnect: true,
  enableOfflineQueue: false,
}

// Only create Redis client if not in build environment
let redisClient: Redis | null = null

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV) {
  redisClient = new Redis(redisConfig)
  
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err)
  })

  redisClient.on('connect', () => {
    console.log('Redis Client Connected')
  })
}

// In-memory cache fallback
const memoryCache = new Map<string, { value: any; expires: number }>()

export class RedisClient {
  private static instance: Redis | null = null
  private static isConnecting: boolean = false
  private static isAvailable: boolean = false

  private constructor() {}

  public static async getInstance(): Promise<Redis | null> {
    // Return null if Redis is not available (during build)
    if (!redisClient) {
      return null
    }

    if (!RedisClient.instance && !RedisClient.isConnecting) {
      RedisClient.isConnecting = true
      try {
        const client = new Redis(redisConfig)

        // Connection events
        client.on('connect', () => {
          logger.info('Redis client connected')
          RedisClient.isAvailable = true
        })

        client.on('error', (error) => {
          logger.error('Redis client error:', error)
          RedisClient.isAvailable = false
        })

        client.on('close', () => {
          logger.warn('Redis connection closed')
          RedisClient.isAvailable = false
        })

        // Wait for ready event with timeout
        await Promise.race([
          new Promise((resolve) => {
            client.once('ready', resolve)
          }),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
          })
        ])

        RedisClient.instance = client
        RedisClient.isAvailable = true
      } catch (error) {
        logger.error('Failed to create Redis client:', error)
        RedisClient.isAvailable = false
        RedisClient.instance = null
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
      
      if (client && RedisClient.isAvailable) {
        const value = await client.get(key)
        if (value) {
          cacheHitTotal.inc({ cache_type: 'redis' })
          return JSON.parse(value)
        }
        cacheMissTotal.inc({ cache_type: 'redis' })
        return null
      } else {
        // Fallback to memory cache
        const cached = memoryCache.get(key)
        if (cached && cached.expires > Date.now()) {
          cacheHitTotal.inc({ cache_type: 'memory' })
          return cached.value
        }
        memoryCache.delete(key)
        cacheMissTotal.inc({ cache_type: 'memory' })
        return null
      }
    } catch (error) {
      logger.error('Cache get error:', error)
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
      
      if (client && RedisClient.isAvailable) {
        const stringValue = JSON.stringify(value)
        
        if (expireSeconds) {
          await client.setex(key, expireSeconds, stringValue)
        } else {
          await client.set(key, stringValue)
        }
      } else {
        // Fallback to memory cache
        const expires = expireSeconds ? Date.now() + (expireSeconds * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 24h default
        memoryCache.set(key, { value, expires })
        
        // Clean up expired entries periodically
        if (memoryCache.size > 1000) {
          for (const [k, v] of memoryCache.entries()) {
            if (v.expires <= Date.now()) {
              memoryCache.delete(k)
            }
          }
        }
      }
    } catch (error) {
      logger.error('Cache set error:', error)
    }
  }

  public static async del(key: string): Promise<void> {
    try {
      const client = await RedisClient.getInstance()
      
      if (client && RedisClient.isAvailable) {
        await client.del(key)
      } else {
        // Fallback to memory cache
        memoryCache.delete(key)
      }
    } catch (error) {
      logger.error('Cache del error:', error)
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