// 🚀 MULTI-DATABASE MANAGER
// Handles automatic sharding, connection pooling, and database scaling

import { PrismaClient } from '@prisma/client';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export interface DatabaseShard {
  id: string;
  shardName: string;
  connectionString: string;
  shardType: 'partition' | 'dedicated' | 'archive';
  maxBusinesses: number;
  currentBusinesses: number;
  status: 'active' | 'readonly' | 'maintenance';
}

export interface ShardingStrategy {
  appointmentCount: number;
  monthlyBookings: number;
  businessAge: number;
  recommendation: 'shared_partition' | 'standard_partition' | 'premium_partition' | 'dedicated_database';
}

export interface MultiDBConfig {
  defaultConnectionString: string;
  maxConnectionsPerShard: number;
  connectionTimeout: number;
  enableReadReplicas: boolean;
  enableWriteSharding: boolean;
}

// ===============================================
// CONNECTION POOL MANAGER
// ===============================================

class ConnectionPoolManager {
  private pools: Map<string, PrismaClient> = new Map();
  private config: MultiDBConfig;

  constructor(config: MultiDBConfig) {
    this.config = config;
  }

  async getConnection(shardId: string, connectionString: string): Promise<PrismaClient> {
    if (!this.pools.has(shardId)) {
      const client = new PrismaClient({
        datasources: {
          db: {
            url: connectionString,
          },
        },
        log: ['query', 'error'],
      });

      // Test connection
      await client.$connect();
      this.pools.set(shardId, client);
    }

    return this.pools.get(shardId)!;
  }

  async closeConnection(shardId: string): Promise<void> {
    const client = this.pools.get(shardId);
    if (client) {
      await client.$disconnect();
      this.pools.delete(shardId);
    }
  }

  async closeAllConnections(): Promise<void> {
    for (const [shardId] of this.pools) {
      await this.closeConnection(shardId);
    }
  }

  getActiveConnections(): string[] {
    return Array.from(this.pools.keys());
  }
}

// ===============================================
// SHARD MANAGER
// ===============================================

class ShardManager {
  private shards: Map<string, DatabaseShard> = new Map();
  private businessShardMapping: Map<string, string> = new Map();
  private masterClient: PrismaClient;

  constructor(masterConnectionString: string) {
    this.masterClient = new PrismaClient({
      datasources: { db: { url: masterConnectionString } },
    });
  }

  async loadShards(): Promise<void> {
    const shards = await this.masterClient.$queryRaw<DatabaseShard[]>`
      SELECT * FROM database_shards WHERE status = 'active'
    `;

    for (const shard of shards) {
      this.shards.set(shard.id, shard);
    }

    // Load business mappings
    const mappings = await this.masterClient.$queryRaw<{ businessId: string; shard_id: string }[]>`
      SELECT "businessId", shard_id FROM business_shard_mapping
    `;

    for (const mapping of mappings) {
      this.businessShardMapping.set(mapping.businessId, mapping.shard_id);
    }
  }

  async getShardForBusiness(businessId: string): Promise<DatabaseShard | null> {
    const shardId = this.businessShardMapping.get(businessId);
    if (!shardId) return null;

    return this.shards.get(shardId) || null;
  }

  async assignBusinessToShard(businessId: string): Promise<DatabaseShard> {
    // Get business sharding strategy
    const strategy = await this.getShardingStrategy(businessId);
    
    // Find appropriate shard based on strategy
    let targetShard: DatabaseShard | null = null;

    if (strategy.recommendation === 'dedicated_database') {
      targetShard = await this.createDedicatedShard(businessId);
    } else {
      targetShard = await this.findAvailableShard(strategy.recommendation);
    }

    if (!targetShard) {
      throw new Error(`No available shard for business ${businessId}`);
    }

    // Create mapping
    await this.masterClient.$executeRaw`
      INSERT INTO business_shard_mapping ("businessId", shard_id)
      VALUES (${businessId}, ${targetShard.id})
      ON CONFLICT ("businessId") DO UPDATE SET shard_id = ${targetShard.id}
    `;

    this.businessShardMapping.set(businessId, targetShard.id);
    return targetShard;
  }

  private async getShardingStrategy(businessId: string): Promise<ShardingStrategy> {
    const result = await this.masterClient.$queryRaw<{ recommendation: string }[]>`
      SELECT classify_business_for_sharding(${businessId}) as recommendation
    `;

    // Get business metrics for context
    const metrics = await this.masterClient.$queryRaw<{
      appointmentCount: bigint;
      monthlyBookings: bigint;
      businessAge: number;
    }[]>`
      SELECT 
        COUNT(*) as appointmentCount,
        COUNT(*) FILTER (WHERE "createdAt" >= NOW() - INTERVAL '30 days') as monthlyBookings,
        EXTRACT(DAYS FROM NOW() - MIN("createdAt")) as businessAge
      FROM appointments 
      WHERE "businessId" = ${businessId}
    `;

    const metric = metrics[0] || { appointmentCount: BigInt(0), monthlyBookings: BigInt(0), businessAge: 0 };

    return {
      appointmentCount: Number(metric.appointmentCount),
      monthlyBookings: Number(metric.monthlyBookings),
      businessAge: metric.businessAge,
      recommendation: result[0]?.recommendation as any || 'shared_partition',
    };
  }

  private async findAvailableShard(type: string): Promise<DatabaseShard | null> {
    for (const shard of this.shards.values()) {
      if (shard.shardType === 'partition' && shard.currentBusinesses < shard.maxBusinesses) {
        return shard;
      }
    }
    return null;
  }

  private async createDedicatedShard(businessId: string): Promise<DatabaseShard> {
    // In production, this would create a new database instance
    // For now, we'll create a logical dedicated shard
    const shardName = `dedicated_${businessId}`;
    const connectionString = process.env.DATABASE_URL!; // Would be new DB URL in production

    const result = await this.masterClient.$queryRaw<{ id: string }[]>`
      INSERT INTO database_shards (shard_name, connection_string, shard_type, max_businesses, current_businesses)
      VALUES (${shardName}, ${connectionString}, 'dedicated', 1, 1)
      RETURNING id
    `;

    const newShard: DatabaseShard = {
      id: result[0].id,
      shardName,
      connectionString,
      shardType: 'dedicated',
      maxBusinesses: 1,
      currentBusinesses: 1,
      status: 'active',
    };

    this.shards.set(newShard.id, newShard);
    return newShard;
  }
}

// ===============================================
// MULTI-DB MANAGER (MAIN CLASS)
// ===============================================

export class MultiDBManager {
  private connectionPool: ConnectionPoolManager;
  private shardManager: ShardManager;
  private config: MultiDBConfig;

  constructor(config: MultiDBConfig) {
    this.config = config;
    this.connectionPool = new ConnectionPoolManager(config);
    this.shardManager = new ShardManager(config.defaultConnectionString);
  }

  async initialize(): Promise<void> {
    await this.shardManager.loadShards();
  }

  async getClientForBusiness(businessId: string): Promise<PrismaClient> {
    // Get or assign shard for business
    let shard = await this.shardManager.getShardForBusiness(businessId);
    
    if (!shard) {
      shard = await this.shardManager.assignBusinessToShard(businessId);
    }

    // Get connection from pool
    return this.connectionPool.getConnection(shard.id, shard.connectionString);
  }

  async executeQuery<T>(
    businessId: string,
    queryFn: (client: PrismaClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClientForBusiness(businessId);
    
    // Set tenant context for this query
    await client.$executeRaw`SET app.current_business_id = ${businessId}`;
    
    try {
      return await queryFn(client);
    } finally {
      // Clear context after query
      await client.$executeRaw`SET app.current_business_id = ''`;
    }
  }

  async executeBatchQuery<T>(
    queries: Array<{ businessId: string; queryFn: (client: PrismaClient) => Promise<T> }>
  ): Promise<T[]> {
    const results = await Promise.all(
      queries.map(({ businessId, queryFn }) => this.executeQuery(businessId, queryFn))
    );
    return results;
  }

  async migrateBusinessToShard(businessId: string, targetShardId: string): Promise<void> {
    const sourceClient = await this.getClientForBusiness(businessId);
    const targetShard = await this.shardManager.getShardForBusiness(businessId);
    
    if (!targetShard) {
      throw new Error(`Target shard ${targetShardId} not found`);
    }

    const targetClient = await this.connectionPool.getConnection(targetShardId, targetShard.connectionString);

    // Migration logic would go here
    // This is a simplified version - production would need careful data migration
    console.log(`Migrating business ${businessId} to shard ${targetShardId}`);
  }

  async getShardStatistics(): Promise<{
    totalShards: number;
    activeConnections: number;
    businessDistribution: Record<string, number>;
  }> {
    const activeConnections = this.connectionPool.getActiveConnections();
    
    return {
      totalShards: activeConnections.length,
      activeConnections: activeConnections.length,
      businessDistribution: {}, // Would calculate business per shard
    };
  }

  async cleanup(): Promise<void> {
    await this.connectionPool.closeAllConnections();
  }
}

// ===============================================
// TENANT-AWARE PRISMA CLIENT (UPDATED)
// ===============================================

export class TenantAwarePrismaV2 {
  private multiDBManager: MultiDBManager;

  constructor(multiDBManager: MultiDBManager) {
    this.multiDBManager = multiDBManager;
  }

  // Appointments with automatic sharding
  async findManyAppointments(businessId: string, args?: any) {
    return this.multiDBManager.executeQuery(businessId, async (client) => {
      // Use partitioned table if available, fallback to regular table
      const usePartitioned = await this.shouldUsePartitioned(client, 'appointments');
      
      if (usePartitioned) {
        return client.$queryRaw`
          SELECT * FROM appointments_partitioned 
          WHERE "businessId" = ${businessId}
          ${args?.where ? this.buildWhereClause(args.where) : ''}
          ORDER BY "scheduledFor" DESC
          LIMIT ${args?.take || 100}
        `;
      }
      
      return client.appointments.findMany({
        where: { businessId, ...args?.where },
        ...args,
      });
    });
  }

  async createAppointment(businessId: string, data: any) {
    return this.multiDBManager.executeQuery(businessId, async (client) => {
      const usePartitioned = await this.shouldUsePartitioned(client, 'appointments');
      
      if (usePartitioned) {
        return client.$queryRaw`
          INSERT INTO appointments_partitioned 
          (id, "businessId", "scheduledFor", duration, "staffId", "clientId", "serviceId", status, notes, "createdAt", "updatedAt")
          VALUES (${data.id}, ${businessId}, ${data.scheduledFor}, ${data.duration}, 
                  ${data.staffId}, ${data.clientId}, ${data.serviceId}, ${data.status || 'PENDING'}, 
                  ${data.notes || null}, NOW(), NOW())
          RETURNING *
        `;
      }
      
      return client.appointments.create({
        data: { ...data, businessId },
      });
    });
  }

  // Clients with automatic sharding
  async findManyClients(businessId: string, args?: any) {
    return this.multiDBManager.executeQuery(businessId, async (client) => {
      const usePartitioned = await this.shouldUsePartitioned(client, 'client');
      
      if (usePartitioned) {
        return client.$queryRaw`
          SELECT * FROM client_partitioned 
          WHERE "businessId" = ${businessId} AND "isDeleted" = false
          ${args?.where ? this.buildWhereClause(args.where) : ''}
          ORDER BY "createdAt" DESC
          LIMIT ${args?.take || 100}
        `;
      }
      
      return client.client.findMany({
        where: { businessId, isDeleted: false, ...args?.where },
        ...args,
      });
    });
  }

  private async shouldUsePartitioned(client: PrismaClient, tableName: string): Promise<boolean> {
    try {
      const result = await client.$queryRaw<{ exists: boolean }[]>`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = ${tableName + '_partitioned'}
        ) as exists
      `;
      return result[0]?.exists || false;
    } catch {
      return false;
    }
  }

  private buildWhereClause(where: any): string {
    // Simplified where clause builder
    // Production version would need comprehensive SQL building
    const conditions = Object.entries(where)
      .map(([key, value]) => `AND "${key}" = '${value}'`)
      .join(' ');
    return conditions;
  }
}

// ===============================================
// SINGLETON EXPORT
// ===============================================

const multiDBConfig: MultiDBConfig = {
  defaultConnectionString: process.env.DATABASE_URL!,
  maxConnectionsPerShard: 20,
  connectionTimeout: 10000,
  enableReadReplicas: false,
  enableWriteSharding: true,
};

export const multiDBManager = new MultiDBManager(multiDBConfig);
export const tenantAwarePrismaV2 = new TenantAwarePrismaV2(multiDBManager);

// Initialize on module load
multiDBManager.initialize().catch(console.error);

// ===============================================
// MIDDLEWARE EXPORTS
// ===============================================

export const withMultiDBContext = (businessId: string) => {
  return async <T>(queryFn: (client: PrismaClient) => Promise<T>): Promise<T> => {
    return multiDBManager.executeQuery(businessId, queryFn);
  };
};

export const withBatchMultiDB = async <T>(
  queries: Array<{ businessId: string; queryFn: (client: PrismaClient) => Promise<T> }>
): Promise<T[]> => {
  return multiDBManager.executeBatchQuery(queries);
}; 