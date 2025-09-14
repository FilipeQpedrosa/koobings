// SECURITY MONITORING & THREAT DETECTION SYSTEM
// Real-time monitoring, alerts, and automated incident response

interface SecurityEvent {
  id: string;
  type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 
        'SUSPICIOUS_ACTIVITY' | 'GEO_ANOMALY' | 'DEVICE_ANOMALY' | 
        'RATE_LIMIT_HIT' | 'SESSION_HIJACK_ATTEMPT';
  userId?: string;
  email?: string;
  ip: string;
  userAgent: string;
  geoLocation: string;
  timestamp: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, any>;
}

interface ThreatScore {
  score: number; // 0-100
  factors: string[];
  recommendation: 'ALLOW' | 'MONITOR' | 'CHALLENGE' | 'BLOCK';
}

class SecurityMonitor {
  private static events: SecurityEvent[] = [];
  private static suspiciousIPs = new Set<string>();
  private static blockedIPs = new Set<string>();

  // Log security event
  static logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.events.push(securityEvent);
    
    // Keep only last 10000 events in memory
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }

    // Real-time threat analysis
    this.analyzeEvent(securityEvent);
    
    console.log(`🛡️ [SECURITY] ${event.type} - ${event.severity} - IP: ${event.ip}`);
  }

  // Calculate threat score for request
  static calculateThreatScore(ip: string, userAgent: string, email?: string): ThreatScore {
    let score = 0;
    const factors: string[] = [];

    // Check if IP is known to be suspicious
    if (this.suspiciousIPs.has(ip)) {
      score += 25;
      factors.push('Suspicious IP');
    }

    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      score += 50;
      factors.push('Blocked IP');
    }

    // Check recent failed attempts from this IP
    const recentFailures = this.getRecentEvents(ip, 'LOGIN_FAILURE', 15 * 60 * 1000);
    if (recentFailures.length >= 5) {
      score += 30;
      factors.push(`${recentFailures.length} recent failures`);
    }

    // Check for rapid requests (potential bot)
    const recentRequests = this.getRecentEvents(ip, undefined, 60 * 1000);
    if (recentRequests.length > 50) {
      score += 20;
      factors.push('High request rate');
    }

    // Check user agent anomalies
    if (this.isAnomalousUserAgent(userAgent)) {
      score += 15;
      factors.push('Suspicious user agent');
    }

    // Check for email enumeration attempts
    if (email && this.hasEmailEnumerationPattern(ip, email)) {
      score += 20;
      factors.push('Email enumeration pattern');
    }

    // Determine recommendation
    let recommendation: ThreatScore['recommendation'];
    if (score >= 70) recommendation = 'BLOCK';
    else if (score >= 50) recommendation = 'CHALLENGE';
    else if (score >= 25) recommendation = 'MONITOR';
    else recommendation = 'ALLOW';

    return { score, factors, recommendation };
  }

  // Get recent events for analysis
  private static getRecentEvents(
    ip: string, 
    type?: SecurityEvent['type'], 
    timeWindow: number = 60 * 1000
  ): SecurityEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(event => 
      event.ip === ip && 
      event.timestamp > cutoff &&
      (type ? event.type === type : true)
    );
  }

  // Analyze security event for threats
  private static analyzeEvent(event: SecurityEvent): void {
    // Auto-block on multiple critical events
    if (event.severity === 'CRITICAL') {
      const criticalEvents = this.getRecentEvents(event.ip, undefined, 5 * 60 * 1000)
        .filter(e => e.severity === 'CRITICAL');
      
      if (criticalEvents.length >= 3) {
        this.blockIP(event.ip, 'Multiple critical security events');
      }
    }

    // Auto-flag suspicious IPs
    if (event.type === 'LOGIN_FAILURE') {
      const failures = this.getRecentEvents(event.ip, 'LOGIN_FAILURE', 10 * 60 * 1000);
      if (failures.length >= 5) {
        this.suspiciousIPs.add(event.ip);
      }
    }

    // Detect geo-location anomalies
    if (event.type === 'LOGIN_SUCCESS' && event.email) {
      this.checkGeoAnomaly(event);
    }
  }

  // Check for geographical anomalies
  private static checkGeoAnomaly(event: SecurityEvent): void {
    if (!event.email) return;

    const recentLogins = this.events
      .filter(e => e.email === event.email && e.type === 'LOGIN_SUCCESS')
      .slice(-10); // Last 10 logins

    const locations = recentLogins.map(e => e.geoLocation).filter(Boolean);
    const uniqueLocations = [...new Set(locations)];

    // If user logged in from 3+ different countries in last 10 logins
    if (uniqueLocations.length >= 3) {
      this.logEvent({
        type: 'GEO_ANOMALY',
        email: event.email,
        ip: event.ip,
        userAgent: event.userAgent,
        geoLocation: event.geoLocation,
        severity: 'HIGH',
        details: { 
          recentLocations: uniqueLocations,
          message: 'Multiple geographic locations detected'
        }
      });
    }
  }

  // Check for anomalous user agents
  private static isAnomalousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /python/i,
      /curl/i,
      /wget/i,
      /postman/i,
      /bot/i,
      /crawler/i,
      /scanner/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  // Check for email enumeration patterns
  private static hasEmailEnumerationPattern(ip: string, email: string): boolean {
    const recentAttempts = this.getRecentEvents(ip, 'LOGIN_FAILURE', 5 * 60 * 1000);
    const uniqueEmails = new Set(recentAttempts.map(e => e.email).filter(Boolean));
    
    // If trying many different emails from same IP
    return uniqueEmails.size > 10;
  }

  // Block IP address
  static blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip);
    
    this.logEvent({
      type: 'RATE_LIMIT_HIT',
      ip,
      userAgent: '',
      geoLocation: 'UNKNOWN',
      severity: 'CRITICAL',
      details: { reason, action: 'IP_BLOCKED' }
    });

    console.log(`🚨 [SECURITY] BLOCKED IP: ${ip} - Reason: ${reason}`);
  }

  // Check if IP is blocked
  static isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  // Generate security report
  static generateSecurityReport(): any {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp > last24h);

    const stats = {
      totalEvents: recentEvents.length,
      eventTypes: {} as Record<string, number>,
      severityLevels: {} as Record<string, number>,
      topIPs: {} as Record<string, number>,
      suspiciousIPs: Array.from(this.suspiciousIPs),
      blockedIPs: Array.from(this.blockedIPs),
      timestamp: now
    };

    // Count events by type
    recentEvents.forEach(event => {
      stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
      stats.severityLevels[event.severity] = (stats.severityLevels[event.severity] || 0) + 1;
      stats.topIPs[event.ip] = (stats.topIPs[event.ip] || 0) + 1;
    });

    return stats;
  }

  // Real-time security dashboard data
  static getDashboardData(): any {
    const report = this.generateSecurityReport();
    const recentCritical = this.events
      .filter(e => e.severity === 'CRITICAL' && e.timestamp > Date.now() - (60 * 60 * 1000))
      .slice(-10);

    return {
      ...report,
      recentCriticalEvents: recentCritical,
      systemStatus: this.getSystemStatus()
    };
  }

  // Get overall system security status
  private static getSystemStatus(): string {
    const criticalEvents = this.events.filter(e => 
      e.severity === 'CRITICAL' && 
      e.timestamp > Date.now() - (5 * 60 * 1000)
    );

    if (criticalEvents.length > 10) return 'UNDER_ATTACK';
    if (criticalEvents.length > 5) return 'HIGH_ALERT';
    if (criticalEvents.length > 0) return 'MONITORING';
    return 'SECURE';
  }
}

// Helper functions for easy integration
export function logSecurityEvent(
  type: SecurityEvent['type'],
  request: any,
  severity: SecurityEvent['severity'] = 'LOW',
  details: Record<string, any> = {},
  email?: string
): void {
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const geoLocation = request.headers.get('cf-ipcountry') || 'UNKNOWN';

  SecurityMonitor.logEvent({
    type,
    email,
    ip,
    userAgent,
    geoLocation,
    severity,
    details
  });
}

export function checkThreatLevel(request: any, email?: string): ThreatScore {
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown';
  const userAgent = request.headers.get('user-agent') || '';

  return SecurityMonitor.calculateThreatScore(ip, userAgent, email);
}

export function isRequestBlocked(request: any): boolean {
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown';

  return SecurityMonitor.isIPBlocked(ip);
}

export function getSecurityDashboard(): any {
  return SecurityMonitor.getDashboardData();
}

export { SecurityMonitor }; 