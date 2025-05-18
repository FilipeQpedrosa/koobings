import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RedisClient } from '@/lib/redis'
import { logger } from '@/lib/logger'

interface CacheConfig {
  ttl: number // Time to live in seconds
  methods?: string[] // HTTP methods to cache (default: ['GET'])
  keyPrefix?: string // Prefix for cache keys
}

const defaultConfig: CacheConfig = {
  ttl: 300, // 5 minutes
  methods: ['GET'],
  keyPrefix: 'api:cache:'
}

export function withCache(config: Partial<CacheConfig> = {}) {
  const finalConfig: CacheConfig = { ...defaultConfig, ...config }

  return async function cache(request: NextRequest) {
    // Only cache configured HTTP methods
    if (!finalConfig.methods?.includes(request.method)) {
      return NextResponse.next()
    }

    // Generate cache key from request
    const cacheKey = `${finalConfig.keyPrefix}${request.url}`

    try {
      // Try to get from cache
      const cachedResponse = await RedisClient.get<{
        data: any
        headers: Record<string, string>
      }>(cacheKey)

      if (cachedResponse) {
        logger.debug('Cache hit', { key: cacheKey })
        return new NextResponse(JSON.stringify(cachedResponse.data), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            ...cachedResponse.headers
          }
        })
      }

      // Cache miss - execute request
      logger.debug('Cache miss', { key: cacheKey })
      const response = await NextResponse.next()
      
      // Only cache successful responses
      if (response.status === 200) {
        const data = await response.json()
        const headers = Object.fromEntries(response.headers.entries())

        // Store in cache
        await RedisClient.set(
          cacheKey,
          { data, headers },
          finalConfig.ttl
        )

        return new NextResponse(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'MISS',
            ...headers
          }
        })
      }

      return response
    } catch (error) {
      logger.error('Cache middleware error', { error, key: cacheKey })
      return NextResponse.next()
    }
  }
}

// Cache invalidation helper
export async function invalidateCache(pattern: string) {
  try {
    const client = await RedisClient.getInstance()
    const keys = await client.keys(pattern)
    
    if (keys.length > 0) {
      await client.del(...keys)
      logger.info('Cache invalidated', { pattern, count: keys.length })
    }
  } catch (error) {
    logger.error('Cache invalidation error', { error, pattern })
  }
} 