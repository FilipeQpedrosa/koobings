// 🛡️ TENANT SECURITY - Zero Trust Architecture
import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// Security levels por tenant
enum SecurityLevel {
  BASIC = 'basic',      // Standard businesses
  ENHANCED = 'enhanced', // Medical/sensitive data
  ENTERPRISE = 'enterprise' // Large businesses
}

interface TenantSecurityConfig {
  businessId: string;
  securityLevel: SecurityLevel;
  encryptionRequired: boolean;
  auditLogging: boolean;
  ipRestrictions: string[];
  sessionTimeout: number; // minutes
  mfaRequired: boolean;
}

class TenantSecurityManager {
  private static instance: TenantSecurityManager;
  private tenantConfigs: Map<string, TenantSecurityConfig> = new Map();

  static getInstance(): TenantSecurityManager {
    if (!TenantSecurityManager.instance) {
      TenantSecurityManager.instance = new TenantSecurityManager();
    }
    return TenantSecurityManager.instance;
  }

  // 🔒 AUTOMATIC TENANT ISOLATION
  async validateTenantAccess(request: NextRequest): Promise<{
    valid: boolean;
    businessId: string | null;
    securityLevel: SecurityLevel;
    restrictions: string[];
  }> {
    const user = getRequestAuthUser(request);
    
    if (!user) {
      return { valid: false, businessId: null, securityLevel: SecurityLevel.BASIC, restrictions: ['No authentication'] };
    }

    const businessId = user.businessId;
    if (!businessId) {
      return { valid: false, businessId: null, securityLevel: SecurityLevel.BASIC, restrictions: ['No business context'] };
    }

    // Get tenant security config
    const config = await this.getTenantConfig(businessId);
    const restrictions: string[] = [];

    // 1. IP Restrictions
    if (config.ipRestrictions.length > 0) {
      const clientIP = this.getClientIP(request);
      if (!config.ipRestrictions.includes(clientIP)) {
        restrictions.push(`IP ${clientIP} not allowed`);
        await this.logSecurityEvent(businessId, 'IP_RESTRICTION_VIOLATION', { clientIP });
      }
    }

    // 2. Session Timeout
    if (user.sessionCreatedAt) {
      const sessionAge = Date.now() - user.sessionCreatedAt;
      const maxAge = config.sessionTimeout * 60 * 1000;
      if (sessionAge > maxAge) {
        restrictions.push('Session expired');
        await this.logSecurityEvent(businessId, 'SESSION_TIMEOUT', { sessionAge, maxAge });
      }
    }

    // 3. MFA Requirement
    if (config.mfaRequired && !user.mfaVerified) {
      restrictions.push('MFA verification required');
    }

    return {
      valid: restrictions.length === 0,
      businessId,
      securityLevel: config.securityLevel,
      restrictions
    };
  }

  // 🔐 DATA ENCRYPTION BY TENANT
  async encryptSensitiveData(businessId: string, data: any): Promise<any> {
    const config = await this.getTenantConfig(businessId);
    
    if (!config.encryptionRequired) {
      return data;
    }

    // Encrypt PII fields based on security level
    const sensitiveFields = this.getSensitiveFields(config.securityLevel);
    const encrypted = { ...data };

    for (const field of sensitiveFields) {
      if (encrypted[field]) {
        encrypted[field] = await this.encrypt(encrypted[field], businessId);
      }
    }

    return encrypted;
  }

  // 📊 AUDIT LOGGING
  async logDataAccess(businessId: string, action: string, resource: string, details: any) {
    const config = await this.getTenantConfig(businessId);
    
    if (!config.auditLogging) return;

    // Log to tenant-specific audit table
    await this.auditLogger.log({
      businessId,
      action,
      resource,
      details,
      timestamp: new Date(),
      securityLevel: config.securityLevel
    });
  }

  // 🚨 REAL-TIME THREAT DETECTION
  async detectAnomalies(businessId: string, user: any, action: string): Promise<boolean> {
    // Check for suspicious patterns
    const recentActions = await this.getRecentActions(businessId, user.id);
    
    // Rate limiting per tenant
    const actionsPerMinute = recentActions.filter(
      a => Date.now() - a.timestamp < 60000
    ).length;
    
    if (actionsPerMinute > 50) {
      await this.logSecurityEvent(businessId, 'RATE_LIMIT_EXCEEDED', { 
        userId: user.id, 
        actionsPerMinute 
      });
      return true; // Suspicious
    }

    // Check for unusual data access patterns
    if (action === 'BULK_EXPORT' && user.role !== 'BUSINESS_OWNER') {
      await this.logSecurityEvent(businessId, 'UNAUTHORIZED_BULK_ACCESS', { userId: user.id });
      return true;
    }

    return false;
  }

  // Helper methods
  private async getTenantConfig(businessId: string): Promise<TenantSecurityConfig> {
    if (this.tenantConfigs.has(businessId)) {
      return this.tenantConfigs.get(businessId)!;
    }

    // Load from database
    const config = await prisma.security_settings.findUnique({
      where: { businessId }
    });

    const tenantConfig: TenantSecurityConfig = {
      businessId,
      securityLevel: config?.securityLevel || SecurityLevel.BASIC,
      encryptionRequired: config?.requireMFA || false,
      auditLogging: config?.enableAccessLogs || true,
      ipRestrictions: config?.allowedIPs || [],
      sessionTimeout: config?.sessionTimeout || 480, // 8 hours
      mfaRequired: config?.requireMFA || false
    };

    this.tenantConfigs.set(businessId, tenantConfig);
    return tenantConfig;
  }

  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] || 
           request.headers.get('x-real-ip') || 
           'unknown';
  }

  private getSensitiveFields(securityLevel: SecurityLevel): string[] {
    switch (securityLevel) {
      case SecurityLevel.ENTERPRISE:
        return ['email', 'phone', 'address', 'notes', 'paymentDetails', 'healthData'];
      case SecurityLevel.ENHANCED:
        return ['email', 'phone', 'notes', 'healthData'];
      case SecurityLevel.BASIC:
      default:
        return ['paymentDetails'];
    }
  }

  private async encrypt(data: string, businessId: string): Promise<string> {
    // Tenant-specific encryption keys
    const key = await this.getTenantEncryptionKey(businessId);
    // Implementation depends on crypto library
    return `encrypted_${data}`; // Placeholder
  }

  private async logSecurityEvent(businessId: string, eventType: string, details: any) {
    console.log(`🚨 SECURITY EVENT [${businessId}]: ${eventType}`, details);
    // Log to security monitoring system
  }
}

// Middleware export
export async function tenantSecurityMiddleware(request: NextRequest) {
  const security = TenantSecurityManager.getInstance();
  const validation = await security.validateTenantAccess(request);

  if (!validation.valid) {
    return NextResponse.json({
      error: 'Tenant access denied',
      restrictions: validation.restrictions
    }, { status: 403 });
  }

  // Set tenant context in headers for downstream processing
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', validation.businessId!);
  response.headers.set('x-security-level', validation.securityLevel);
  
  return response;
}

export const tenantSecurity = TenantSecurityManager.getInstance(); 