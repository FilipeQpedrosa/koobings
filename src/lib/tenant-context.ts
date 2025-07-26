// 🎯 TENANT CONTEXT - Automatic Business Isolation
import { prisma } from '@/lib/prisma';

class TenantAwarePrisma {
  private currentBusinessId: string | null = null;

  constructor() {
    // Using singleton prisma instance instead of creating new one
  }

  async setTenantContext(businessId: string): Promise<void> {
    this.currentBusinessId = businessId;
    await prisma.$executeRaw`SET app.current_business_id = ${businessId}`;
  }

  async clearTenantContext(): Promise<void> {
    this.currentBusinessId = null;
    await prisma.$executeRaw`SET app.current_business_id = ''`;
  }

  // 📋 APPOINTMENTS WITH TENANT CONTEXT
  async findManyAppointments(businessId: string, args?: any) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.appointments.findMany({
        where: {
          businessId,
          ...args?.where
        },
        ...args,
      });
    } finally {
      await this.clearTenantContext();
    }
  }

  async findUniqueAppointment(businessId: string, where: any) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.appointments.findUnique({
        where: {
          ...where,
          businessId,
        },
      });
    } finally {
      await this.clearTenantContext();
    }
  }

  async createAppointment(businessId: string, data: any) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.appointments.create({
        data: {
          ...data,
          businessId,
        },
      });
    } finally {
      await this.clearTenantContext();
    }
  }

  // 👥 CLIENTS WITH TENANT CONTEXT
  async findManyClients(businessId: string, args?: any) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.client.findMany({
        where: {
          businessId,
          isDeleted: false,
          ...args?.where
        },
        ...args,
      });
    } finally {
      await this.clearTenantContext();
    }
  }

  async findUniqueClient(businessId: string, where: any) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.client.findUnique({
        where: {
          ...where,
          businessId,
        },
      });
    } finally {
      await this.clearTenantContext();
    }
  }

  async createClient(businessId: string, data: any) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.client.create({
        data: {
          ...data,
          businessId,
        },
      });
    } finally {
      await this.clearTenantContext();
    }
  }

  // 🔍 OPTIMIZED QUERIES WITH RAW SQL
  async findManyWithDetails(businessId: string, table: string, limit: number = 100) {
    await this.setTenantContext(businessId);
    try {
      return await prisma.$queryRaw`
        SELECT * FROM ${prisma.$executeRawUnsafe(`"${table}"`)} 
        WHERE "businessId" = ${businessId}
        ORDER BY "createdAt" DESC
        LIMIT ${limit}
      `;
    } finally {
      await this.clearTenantContext();
    }
  }
}

// Export singleton instance
export const tenantPrisma = new TenantAwarePrisma();

// Middleware para automatic tenant context
export const withTenantContext = async <T>(
  businessId: string,
  operation: () => Promise<T>
): Promise<T> => {
  await tenantPrisma.setTenantContext(businessId);
  try {
    return await operation();
  } finally {
    await tenantPrisma.clearTenantContext();
  }
}; 