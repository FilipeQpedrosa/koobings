// 🎛️ RESOURCE MANAGEMENT - Tenant Isolation
import { PrismaClient } from '@prisma/client';

interface ResourceLimits {
  maxMemoryMB: number;
  maxCpuPercent: number;
  maxConcurrentQueries: number;
  maxQueryDurationMs: number;
  maxResultSetSize: number;
  connectionPoolSize: number;
}

interface TenantTier {
  name: string;
  limits: ResourceLimits;
  priority: number; // 1-10, higher = more resources
}

const TENANT_TIERS: Record<string, TenantTier> = {
  'free': {
    name: 'Free',
    limits: {
      maxMemoryMB: 50,
      maxCpuPercent: 5,
      maxConcurrentQueries: 2,
      maxQueryDurationMs: 5000,
      maxResultSetSize: 100,
      connectionPoolSize: 2
    },
    priority: 1
  },
  'starter': {
    name: 'Starter',
    limits: {
      maxMemoryMB: 200,
      maxCpuPercent: 15,
      maxConcurrentQueries: 5,
      maxQueryDurationMs: 10000,
      maxResultSetSize: 1000,
      connectionPoolSize: 5
    },
    priority: 3
  },
  'professional': {
    name: 'Professional', 
    limits: {
      maxMemoryMB: 500,
      maxCpuPercent: 30,
      maxConcurrentQueries: 10,
      maxQueryDurationMs: 30000,
      maxResultSetSize: 5000,
      connectionPoolSize: 10
    },
    priority: 6
  },
  'enterprise': {
    name: 'Enterprise',
    limits: {
      maxMemoryMB: 2000,
      maxCpuPercent: 80,
      maxConcurrentQueries: 50,
      maxQueryDurationMs: 120000,
      maxResultSetSize: 50000,
      connectionPoolSize: 25
    },
    priority: 10
  }
};

class ResourceManager {
  private static instance: ResourceManager;
  private activeQueries: Map<string, number> = new Map(); // businessId -> count
  private resourceUsage: Map<string, { memory: number; cpu: number; queries: number }> = new Map();

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  // 🎯 RESOURCE ALLOCATION
  async allocateResources(businessId: string, queryType: string): Promise<{
    allowed: boolean;
    tier: string;
    reason?: string;
    waitTime?: number;
  }> {
    const tier = await this.getBusinessTier(businessId);
    const limits = TENANT_TIERS[tier].limits;
    const currentUsage = this.resourceUsage.get(businessId) || { memory: 0, cpu: 0, queries: 0 };

    // 1. Check concurrent queries limit
    const activeQueries = this.activeQueries.get(businessId) || 0;
    if (activeQueries >= limits.maxConcurrentQueries) {
      return {
        allowed: false,
        tier,
        reason: `Max concurrent queries (${limits.maxConcurrentQueries}) exceeded`,
        waitTime: this.estimateWaitTime(businessId)
      };
    }

    // 2. Check resource usage
    if (currentUsage.memory > limits.maxMemoryMB) {
      return {
        allowed: false,
        tier,
        reason: `Memory limit (${limits.maxMemoryMB}MB) exceeded`,
        waitTime: 5000 // 5 seconds
      };
    }

    // 3. Queue management for lower tier businesses
    if (tier === 'free' && this.getSystemLoad() > 80) {
      return {
        allowed: false,
        tier,
        reason: 'System overloaded, free tier queued',
        waitTime: this.calculateQueueWaitTime(businessId)
      };
    }

    return { allowed: true, tier };
  }

  // 🔒 QUERY EXECUTION WITH LIMITS
  async executeWithLimits<T>(
    businessId: string, 
    queryFn: () => Promise<T>,
    queryType: string = 'READ'
  ): Promise<T> {
    const allocation = await this.allocateResources(businessId, queryType);
    
    if (!allocation.allowed) {
      if (allocation.waitTime) {
        // Queue the request
        await this.waitInQueue(businessId, allocation.waitTime);
        return this.executeWithLimits(businessId, queryFn, queryType);
      }
      throw new Error(`Resource limit exceeded: ${allocation.reason}`);
    }

    const tier = allocation.tier;
    const limits = TENANT_TIERS[tier].limits;

    // Track query execution
    this.incrementActiveQueries(businessId);
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      // Set query timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Query timeout (${limits.maxQueryDurationMs}ms)`)), 
                  limits.maxQueryDurationMs);
      });

      const result = await Promise.race([queryFn(), timeoutPromise]) as T;

      // Check result size limits
      if (Array.isArray(result) && result.length > limits.maxResultSetSize) {
        console.warn(`⚠️ Result set truncated for ${businessId}: ${result.length} -> ${limits.maxResultSetSize}`);
        return result.slice(0, limits.maxResultSetSize) as T;
      }

      return result;

    } finally {
      // Track resource usage
      const duration = Date.now() - startTime;
      const memoryUsed = (process.memoryUsage().heapUsed - startMemory) / 1024 / 1024; // MB
      
      this.updateResourceUsage(businessId, memoryUsed, duration);
      this.decrementActiveQueries(businessId);
    }
  }

  // 📊 CONNECTION POOLING POR TENANT
  createTenantPrismaClient(businessId: string): PrismaClient {
    const tier = this.getBusinessTierSync(businessId);
    const limits = TENANT_TIERS[tier].limits;

    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      // Tenant-specific connection pool
      __internal: {
        connectionTimeout: 5000,
        queryTimeout: limits.maxQueryDurationMs,
        connectionPoolTimeout: 2000,
        connectionPoolSize: limits.connectionPoolSize
      } as any
    });
  }

  // 🚦 PRIORITY QUEUE SYSTEM
  private async calculateQueueWaitTime(businessId: string): Promise<number> {
    const tier = await this.getBusinessTier(businessId);
    const priority = TENANT_TIERS[tier].priority;
    
    // Higher priority = shorter wait
    const baseWait = 10000; // 10 seconds
    const priorityMultiplier = (11 - priority) / 10; // 0.1 to 1.0
    
    return Math.round(baseWait * priorityMultiplier);
  }

  // 💾 MEMORY PRESSURE HANDLING
  async handleMemoryPressure(): Promise<void> {
    const systemMemory = process.memoryUsage();
    const usagePercent = (systemMemory.heapUsed / systemMemory.heapTotal) * 100;

    if (usagePercent > 85) {
      console.log('🚨 High memory pressure detected, implementing restrictions');
      
      // Restrict low-tier businesses first
      const freeBusinesses = await this.getBusinessesByTier('free');
      for (const businessId of freeBusinesses) {
        await this.throttleBusinessQueries(businessId, 0.5); // 50% throttle
      }

      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
    }
  }

  // Helper methods
  private incrementActiveQueries(businessId: string): void {
    const current = this.activeQueries.get(businessId) || 0;
    this.activeQueries.set(businessId, current + 1);
  }

  private decrementActiveQueries(businessId: string): void {
    const current = this.activeQueries.get(businessId) || 0;
    this.activeQueries.set(businessId, Math.max(0, current - 1));
  }

  private updateResourceUsage(businessId: string, memoryMB: number, durationMs: number): void {
    const current = this.resourceUsage.get(businessId) || { memory: 0, cpu: 0, queries: 0 };
    
    // Exponential moving average
    const alpha = 0.3;
    current.memory = (alpha * memoryMB) + ((1 - alpha) * current.memory);
    current.queries = current.queries + 1;
    
    this.resourceUsage.set(businessId, current);
  }

  private getSystemLoad(): number {
    // Simplified system load calculation
    const totalActiveQueries = Array.from(this.activeQueries.values()).reduce((sum, count) => sum + count, 0);
    return Math.min(100, (totalActiveQueries / 100) * 100); // Cap at 100%
  }

  private async getBusinessTier(businessId: string): Promise<string> {
    // This would query the database for business subscription tier
    // For now, return default
    return 'starter';
  }

  private getBusinessTierSync(businessId: string): string {
    // Cached version
    return 'starter';
  }

  private async waitInQueue(businessId: string, waitTime: number): Promise<void> {
    console.log(`⏳ Business ${businessId} queued for ${waitTime}ms`);
    return new Promise(resolve => setTimeout(resolve, waitTime));
  }

  private estimateWaitTime(businessId: string): number {
    const activeQueries = this.activeQueries.get(businessId) || 0;
    return activeQueries * 2000; // 2 seconds per queued query
  }

  private async getBusinessesByTier(tier: string): Promise<string[]> {
    // Query database for businesses in specific tier
    return [];
  }

  private async throttleBusinessQueries(businessId: string, factor: number): Promise<void> {
    // Implement query throttling
    console.log(`🐌 Throttling ${businessId} queries by ${factor * 100}%`);
  }
}

// Export singleton
export const resourceManager = ResourceManager.getInstance();

// Middleware para aplicar resource limits
export async function withResourceLimits<T>(
  businessId: string,
  queryFn: () => Promise<T>,
  queryType: string = 'READ'
): Promise<T> {
  return resourceManager.executeWithLimits(businessId, queryFn, queryType);
} 