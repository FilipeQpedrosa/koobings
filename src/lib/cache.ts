// Local cache system for critical data when APIs fail
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

class LocalCache {
  private cache = new Map<string, CacheItem<any>>();
  
  set<T>(key: string, data: T, ttlMinutes: number = 10): void {
    const ttl = ttlMinutes * 60 * 1000; // convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  // Get cache info for debugging
  getInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const localCache = new LocalCache();

// Helper functions for common cache operations
export const cacheKeys = {
  BUSINESSES: 'admin:businesses',
  USER_BUSINESS_INFO: (businessId: string) => `business:info:${businessId}`,
  SERVICES: (businessId: string) => `business:services:${businessId}`,
  STAFF: (businessId: string) => `business:staff:${businessId}`,
  CLIENTS: (businessId: string) => `business:clients:${businessId}`,
} as const;

// Cache wrapper for API calls
export async function cachedApiCall<T>(
  cacheKey: string,
  apiCall: () => Promise<T>,
  ttlMinutes: number = 10
): Promise<T> {
  // Try to get from cache first
  const cached = localCache.get<T>(cacheKey);
  if (cached) {
    console.log(`📦 Cache hit for: ${cacheKey}`);
    return cached;
  }
  
  try {
    // Make API call
    const data = await apiCall();
    
    // Cache the result
    localCache.set(cacheKey, data, ttlMinutes);
    console.log(`💾 Cached data for: ${cacheKey}`);
    
    return data;
  } catch (error) {
    console.error(`❌ API call failed for ${cacheKey}:`, error);
    throw error;
  }
} 