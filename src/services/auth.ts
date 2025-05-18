import { PrismaClient, StaffRole, AdminRole, DataAccessType } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface AuthUser {
  id: string;
  email: string;
  role: StaffRole | AdminRole;
  businessId?: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly TOKEN_EXPIRY = '24h';

  async validatePermission(userId: string, action: string, resource: string, businessId?: string) {
    const staff = await prisma.staff.findUnique({
      where: { id: userId },
      include: {
        permissions: true
      }
    });

    if (!staff) {
      throw new Error('User not found');
    }

    // Check if user has explicit permission
    const permission = staff.permissions.find(p => 
      p.resource === resource && 
      (!businessId || p.businessId === businessId)
    );

    if (!permission) {
      // Check role-based permissions
      return this.hasRolePermission(staff.role, action, resource);
    }

    return this.validateAccessLevel(permission.accessLevel, action);
  }

  private hasRolePermission(role: StaffRole, action: string, resource: string): boolean {
    const rolePermissions: Record<StaffRole, string[]> = {
      ADMIN: [
        'read:*',
        'write:appointments',
        'write:services',
        'write:staff',
        'write:clients'
      ],
      MANAGER: [
        'read:appointments',
        'read:clients',
        'write:appointments',
        'write:availability'
      ],
      STANDARD: [
        'read:appointments',
        'read:clients',
        'write:appointments'
      ]
    };

    const allowedActions = rolePermissions[role] || [];
    return allowedActions.some(allowed => 
      allowed === '*' || 
      allowed === `${action}:*` || 
      allowed === `${action}:${resource}`
    );
  }

  private validateAccessLevel(level: string, action: string): boolean {
    const accessLevels: Record<string, string[]> = {
      FULL: ['read', 'write', 'delete'],
      RESTRICTED: ['read', 'write'],
      BASIC: ['read'],
      NONE: []
    };

    return accessLevels[level]?.includes(action) || false;
  }

  async createAccessLog(
    userId: string,
    businessId: string,
    accessType: DataAccessType,
    resource: string,
    reason: string,
    successful: boolean
  ) {
    return prisma.dataAccessLog.create({
      data: {
        staffId: userId,
        businessId,
        accessType,
        resource,
        reason,
        successful,
        ipAddress: '', // Should be provided by the API layer
        userAgent: '', // Should be provided by the API layer
      }
    });
  }

  async validateSensitiveDataAccess(
    userId: string,
    businessId: string
  ): Promise<boolean> {
    const staff = await prisma.staff.findUnique({
      where: { id: userId },
      include: {
        business: {
          include: {
            securitySettings: true
          }
        }
      }
    });

    if (!staff) return false;

    const settings = staff.business.securitySettings;
    if (!settings) return false;

    // Check if MFA is required and enabled
    if (settings.requireMFA && !staff.mfaEnabled) {
      return false;
    }

    // Check IP restrictions
    if (settings.enforceIPRestriction) {
      // IP validation should be done at the API layer
    }

    // Check access expiry
    if (settings.sensitiveDataAccessExpiry) {
      const lastAccess = await prisma.dataAccessLog.findFirst({
        where: {
          staffId: userId,
          successful: true
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      if (lastAccess) {
        const expiryTime = new Date(lastAccess.timestamp);
        expiryTime.setMinutes(expiryTime.getMinutes() + settings.sensitiveDataAccessExpiry);
        if (new Date() > expiryTime) {
          return false;
        }
      }
    }

    return true;
  }

  async generateToken(user: AuthUser): Promise<string> {
    return sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId
      },
      this.JWT_SECRET,
      { expiresIn: this.TOKEN_EXPIRY }
    );
  }

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = verify(token, this.JWT_SECRET) as AuthUser;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 