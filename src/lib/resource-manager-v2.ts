// 🎛️ RESOURCE MANAGER V2 - Database-Integrated Tenant Isolation
import { prisma } from '@/lib/prisma';

interface BusinessTier {
  businessId: string;
  tier: 'free' | 'starter' | 'professional' | 'enterprise';
  maxConcurrentQueries: number;
  maxQueryDurationMs: number;
  maxResultSetSize: number;
  connectionPoolSize: number;
  maxMemoryMB: number;
  analyticsEnabled: boolean;
  prioritySupport: boolean;
}

interface ResourceUsage {
  businessId: string;
  queryType: string;
  executionTimeMs: number;
  memoryUsedMB: number;
  timestamp: Date;
}

class ResourceManagerV2 {
  private static instance: ResourceManagerV2;
  private activeQueries: Map<string, number> = new Map();
  private businessTiers: Map<string, BusinessTier> = new Map();
  private resourceUsage: Map<string, ResourceUsage> = new Map();

  private constructor() {
    // Using singleton prisma instance instead of creating new one
  }

  static getInstance(): ResourceManagerV2 {
    if (!ResourceManagerV2.instance) {
      ResourceManagerV2.instance = new ResourceManagerV2();
    }
    return ResourceManagerV2.instance;
  }

  // 🎯 GET BUSINESS TIER FROM DATABASE
  async getBusinessTier(businessId: string): Promise<BusinessTier> {
    // Check cache first
    if (this.businessTiers.has(businessId)) {
      return this.businessTiers.get(businessId)!;
    }

    try {
      // Get from database
      const tierData = await prisma.$queryRaw<any[]>`
        SELECT 
          "businessId", tier, "maxConcurrentQueries", "maxQueryDurationMs",
          "maxResultSetSize", "connectionPoolSize", "maxMemoryMB",
          "analyticsEnabled", "prioritySupport"
        FROM business_tiers 
        WHERE "businessId" = ${businessId}
      `;

      let tier: BusinessTier;
      
      if (tierData.length > 0) {
        const data = tierData[0];
        tier = {
          businessId,
          tier: data.tier,
          maxConcurrentQueries: data.maxConcurrentQueries,
          maxQueryDurationMs: data.maxQueryDurationMs,
          maxResultSetSize: data.maxResultSetSize,
          connectionPoolSize: data.connectionPoolSize,
          maxMemoryMB: data.maxMemoryMB,
          analyticsEnabled: data.analyticsEnabled,
          prioritySupport: data.prioritySupport
        };
      } else {
        // Default for new businesses
        tier = {
          businessId,
          tier: 'starter',
          maxConcurrentQueries: 5,
          maxQueryDurationMs: 10000,
          maxResultSetSize: 1000,
          connectionPoolSize: 5,
          maxMemoryMB: 200,
          analyticsEnabled: true,
          prioritySupport: false
        };
        
        // Create tier in database
        await this.createBusinessTier(businessId, tier);
      }

      // Cache it
      this.businessTiers.set(businessId, tier);
      return tier;
      
    } catch (error) {
      console.error('Error getting business tier:', error);
      // Return default on error
      const defaultTier: BusinessTier = {
        businessId,
        tier: 'starter',
        maxConcurrentQueries: 5,
        maxQueryDurationMs: 10000,
        maxResultSetSize: 1000,
        connectionPoolSize: 5,
        maxMemoryMB: 200,
        analyticsEnabled: true,
        prioritySupport: false
      };
      return defaultTier;
    }
  }

  // 🔄 CREATE BUSINESS TIER IN DATABASE
  private async createBusinessTier(businessId: string, tier: BusinessTier): Promise<void> {
    try {
      await prisma.$executeRaw`
        INSERT INTO business_tiers (
          "businessId", tier, "maxConcurrentQueries", "maxQueryDurationMs",
          "maxResultSetSize", "connectionPoolSize", "maxMemoryMB",
          "analyticsEnabled", "prioritySupport", "createdAt", "updatedAt"
        ) VALUES (
          ${businessId}, ${tier.tier}, ${tier.maxConcurrentQueries}, ${tier.maxQueryDurationMs},
          ${tier.maxResultSetSize}, ${tier.connectionPoolSize}, ${tier.maxMemoryMB},
          ${tier.analyticsEnabled}, ${tier.prioritySupport}, NOW(), NOW()
        )
        ON CONFLICT ("businessId") DO UPDATE SET
          tier = ${tier.tier},
          "maxConcurrentQueries" = ${tier.maxConcurrentQueries},
          "maxQueryDurationMs" = ${tier.maxQueryDurationMs},
          "updatedAt" = NOW()
      `;
    } catch (error) {
      console.error('Error creating business tier:', error);
    }
  }

  // 🎯 ALLOCATE RESOURCES FOR BUSINESS
  async allocateResources(businessId: string, queryType: string = 'READ'): Promise<{
    allowed: boolean;
    tier: BusinessTier;
    reason?: string;
    waitTime?: number;
  }> {
    const tier = await this.getBusinessTier(businessId);
    const activeQueries = this.activeQueries.get(businessId) || 0;

    // Check concurrent query limit
    if (activeQueries >= tier.maxConcurrentQueries) {
      return {
        allowed: false,
        tier,
        reason: 'Max concurrent queries exceeded',
        waitTime: this.estimateWaitTime(businessId, tier)
      };
    }

    // Check quota limits
    const quotaCheck = await this.checkQuota(businessId);
    if (!quotaCheck.allowed) {
      return {
        allowed: false,
        tier,
        reason: quotaCheck.reason,
        waitTime: this.getQuotaResetTime()
      };
    }

    return {
      allowed: true,
      tier
    };
  }

  // 🔍 CHECK QUOTA LIMITS
  private async checkQuota(businessId: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const result = await prisma.$queryRaw<Array<{ allowed: boolean; reason?: string }>>`
        SELECT check_and_update_quota(${businessId}) as allowed
      `;
      
      return { allowed: result[0]?.allowed || false };
    } catch (error) {
      console.error('Error checking quota:', error);
      return { allowed: true }; // Fail open
    }
  }

  // ⚡ EXECUTE WITH RESOURCE LIMITS
  async executeWithLimits<T>(
    businessId: string,
    queryFn: () => Promise<T>,
    queryType: string = 'READ'
  ): Promise<T> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    // Check resource allocation
    const allocation = await this.allocateResources(businessId, queryType);
    if (!allocation.allowed) {
      throw new Error(`Resource limit exceeded: ${allocation.reason}`);
    }

    // Track active query
    this.incrementActiveQueries(businessId);

    try {
      // Execute with timeout
      const timeoutPromise = new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), allocation.tier.maxQueryDurationMs);
      });

      const result = await Promise.race([queryFn(), timeoutPromise]);

      // Log successful execution
      const executionTime = Date.now() - startTime;
      const memoryUsed = this.getMemoryUsed(startMemory);
      
      await this.logResourceUsage(businessId, queryType, executionTime, memoryUsed, 'SUCCESS');

      return result as T;

    } catch (error) {
      // Log failed execution
      const executionTime = Date.now() - startTime;
      const memoryUsed = this.getMemoryUsed(startMemory);
      
      await this.logResourceUsage(businessId, queryType, executionTime, memoryUsed, 'FAILED');
      throw error;

    } finally {
      // Always decrement active queries
      this.decrementActiveQueries(businessId);
    }
  }

  // 📊 LOG RESOURCE USAGE
  private async logResourceUsage(
    businessId: string,
    queryType: string,
    executionTimeMs: number,
    memoryUsedMB: number,
    status: string
  ): Promise<void> {
    try {
      await prisma.$executeRaw`
        SELECT log_resource_usage(
          ${businessId}, ${queryType}, ${executionTimeMs}, 
          ${memoryUsedMB}, ${status}
        )
      `;
    } catch (error) {
      console.error('Error logging resource usage:', error);
    }
  }

  // 📊 GET SYSTEM LOAD
  private async getSystemLoad(): Promise<number> {
    try {
      const totalActive = Array.from(this.activeQueries.values())
        .reduce((sum, count) => sum + count, 0);
      
      // Simple load calculation: 100% = 50 concurrent queries across all businesses
      return Math.min(100, (totalActive / 50) * 100);
    } catch {
      return 0;
    }
  }

  // 🕐 WAIT TIME CALCULATIONS
  private getQuotaResetTime(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime(); // ms until midnight
  }

  private estimateWaitTime(businessId: string, tier: BusinessTier): number {
    const activeQueries = this.activeQueries.get(businessId) || 0;
    const avgQueryTime = 2000; // 2 seconds average
    const queuePosition = Math.max(0, activeQueries - tier.maxConcurrentQueries);
    return queuePosition * avgQueryTime;
  }

  private calculateQueueWaitTime(businessId: string, tier: BusinessTier): number {
    // Priority queue: enterprise < professional < starter < free
    const priorityMap = { enterprise: 1, professional: 2, starter: 3, free: 4 };
    const priority = priorityMap[tier.tier];
    const baseWait = 5000; // 5 seconds
    return baseWait * priority;
  }

  // 🔧 HELPER METHODS
  private incrementActiveQueries(businessId: string): void {
    const current = this.activeQueries.get(businessId) || 0;
    this.activeQueries.set(businessId, current + 1);
  }

  private decrementActiveQueries(businessId: string): void {
    const current = this.activeQueries.get(businessId) || 0;
    this.activeQueries.set(businessId, Math.max(0, current - 1));
  }

  private getMemoryUsed(startMemory: number): number {
    return (process.memoryUsage().heapUsed - startMemory) / 1024 / 1024; // MB
  }

  // 📊 GET BUSINESS METRICS
  async getBusinessMetrics(businessId: string): Promise<any> {
    try {
      const result = await prisma.$queryRaw<Array<any>>`
        SELECT * FROM business_resource_status WHERE "businessId" = ${businessId}
      `;
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting business metrics:', error);
      return null;
    }
  }

  // 🔄 UPDATE BUSINESS TIER
  async updateBusinessTier(businessId: string): Promise<void> {
    try {
      await prisma.$executeRaw`
        SELECT classify_business_tier(${businessId})
      `;
      // Clear cache so next request gets fresh data
      this.businessTiers.delete(businessId);
    } catch (error) {
      console.error('Error updating business tier:', error);
    }
  }
}

// Export singleton
export const resourceManagerV2 = ResourceManagerV2.getInstance();

// Enhanced middleware
export async function withResourceLimitsV2<T>(
  businessId: string,
  queryFn: () => Promise<T>,
  queryType: string = 'READ'
): Promise<T> {
  return resourceManagerV2.executeWithLimits(businessId, queryFn, queryType);
} 