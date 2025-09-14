// AI-POWERED SECURITY SYSTEM
// Machine learning for advanced threat detection

interface LoginPattern {
  userId: string;
  email: string;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  geoLocation: string;
  deviceFingerprint: string;
  sessionDuration: number;
  actionsPerSession: number;
}

interface BehaviorProfile {
  userId: string;
  typicalLoginTimes: number[];
  typicalLocations: string[];
  typicalDevices: string[];
  averageSessionDuration: number;
  typicalActionsPerSession: number;
  lastUpdated: number;
}

class AISecurityEngine {
  private static userProfiles = new Map<string, BehaviorProfile>();
  private static learningData: LoginPattern[] = [];

  // Learn from user behavior
  static learnUserBehavior(pattern: LoginPattern): void {
    this.learningData.push(pattern);
    
    // Keep only recent data for learning
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
    this.learningData = this.learningData.filter(p => p.sessionDuration > cutoff);
    
    this.updateUserProfile(pattern);
  }

  // Update user behavioral profile
  private static updateUserProfile(pattern: LoginPattern): void {
    let profile = this.userProfiles.get(pattern.userId);
    
    if (!profile) {
      profile = {
        userId: pattern.userId,
        typicalLoginTimes: [pattern.timeOfDay],
        typicalLocations: [pattern.geoLocation],
        typicalDevices: [pattern.deviceFingerprint],
        averageSessionDuration: pattern.sessionDuration,
        typicalActionsPerSession: pattern.actionsPerSession,
        lastUpdated: Date.now()
      };
    } else {
      // Machine learning: weighted updates
      const weight = 0.1; // Learning rate
      
      // Update timing patterns
      if (!profile.typicalLoginTimes.includes(pattern.timeOfDay)) {
        profile.typicalLoginTimes.push(pattern.timeOfDay);
        profile.typicalLoginTimes = profile.typicalLoginTimes.slice(-10); // Keep recent
      }
      
      // Update location patterns
      if (!profile.typicalLocations.includes(pattern.geoLocation)) {
        profile.typicalLocations.push(pattern.geoLocation);
        profile.typicalLocations = profile.typicalLocations.slice(-5); // Keep recent
      }
      
      // Update device patterns
      if (!profile.typicalDevices.includes(pattern.deviceFingerprint)) {
        profile.typicalDevices.push(pattern.deviceFingerprint);
        profile.typicalDevices = profile.typicalDevices.slice(-3); // Keep recent
      }
      
      // Exponential moving average for numerical values
      profile.averageSessionDuration = 
        (1 - weight) * profile.averageSessionDuration + weight * pattern.sessionDuration;
      
      profile.typicalActionsPerSession = 
        (1 - weight) * profile.typicalActionsPerSession + weight * pattern.actionsPerSession;
      
      profile.lastUpdated = Date.now();
    }
    
    this.userProfiles.set(pattern.userId, profile);
  }

  // AI-powered anomaly detection
  static detectAnomalies(userId: string, currentPattern: Partial<LoginPattern>): {
    anomalyScore: number;
    anomalies: string[];
    recommendation: 'ALLOW' | 'MONITOR' | 'CHALLENGE' | 'BLOCK';
  } {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      // New user - higher scrutiny but allow
      return {
        anomalyScore: 30,
        anomalies: ['New user - no behavioral profile'],
        recommendation: 'MONITOR'
      };
    }

    let anomalyScore = 0;
    const anomalies: string[] = [];

    // Time-based anomaly detection
    if (currentPattern.timeOfDay !== undefined) {
      const timeDistance = Math.min(
        ...profile.typicalLoginTimes.map(t => 
          Math.min(Math.abs(t - currentPattern.timeOfDay!), 24 - Math.abs(t - currentPattern.timeOfDay!))
        )
      );
      
      if (timeDistance > 4) { // More than 4 hours from typical
        anomalyScore += 20;
        anomalies.push(`Unusual login time (${currentPattern.timeOfDay}h)`);
      }
    }

    // Location-based anomaly detection
    if (currentPattern.geoLocation && !profile.typicalLocations.includes(currentPattern.geoLocation)) {
      anomalyScore += 30;
      anomalies.push(`New location: ${currentPattern.geoLocation}`);
    }

    // Device-based anomaly detection
    if (currentPattern.deviceFingerprint && !profile.typicalDevices.includes(currentPattern.deviceFingerprint)) {
      anomalyScore += 25;
      anomalies.push('New device detected');
    }

    // Session duration anomaly
    if (currentPattern.sessionDuration !== undefined) {
      const durationDiff = Math.abs(currentPattern.sessionDuration - profile.averageSessionDuration);
      const threshold = profile.averageSessionDuration * 0.5; // 50% deviation
      
      if (durationDiff > threshold) {
        anomalyScore += 15;
        anomalies.push('Unusual session duration');
      }
    }

    // Actions per session anomaly
    if (currentPattern.actionsPerSession !== undefined) {
      const actionsDiff = Math.abs(currentPattern.actionsPerSession - profile.typicalActionsPerSession);
      const threshold = profile.typicalActionsPerSession * 0.7; // 70% deviation
      
      if (actionsDiff > threshold) {
        anomalyScore += 10;
        anomalies.push('Unusual activity level');
      }
    }

    // Determine recommendation based on AI analysis
    let recommendation: 'ALLOW' | 'MONITOR' | 'CHALLENGE' | 'BLOCK';
    if (anomalyScore >= 80) recommendation = 'BLOCK';
    else if (anomalyScore >= 60) recommendation = 'CHALLENGE';
    else if (anomalyScore >= 30) recommendation = 'MONITOR';
    else recommendation = 'ALLOW';

    return { anomalyScore, anomalies, recommendation };
  }

  // Predictive threat analysis
  static predictThreatLevel(patterns: LoginPattern[]): {
    threatLevel: number;
    prediction: string;
    confidence: number;
  } {
    if (patterns.length < 10) {
      return {
        threatLevel: 0,
        prediction: 'Insufficient data for prediction',
        confidence: 0
      };
    }

    // Simple pattern analysis (in production, use more sophisticated ML)
    const recentPatterns = patterns.slice(-50);
    
    // Check for escalating anomalies
    let threatLevel = 0;
    let confidence = 0;
    
    // Pattern 1: Increasing frequency of new locations
    const uniqueLocations = new Set(recentPatterns.map(p => p.geoLocation));
    if (uniqueLocations.size > 10) {
      threatLevel += 30;
      confidence += 20;
    }
    
    // Pattern 2: Unusual time clustering
    const nightLogins = recentPatterns.filter(p => p.timeOfDay < 6 || p.timeOfDay > 22);
    if (nightLogins.length > recentPatterns.length * 0.7) {
      threatLevel += 20;
      confidence += 15;
    }
    
    // Pattern 3: Short session anomaly (potential automated access)
    const shortSessions = recentPatterns.filter(p => p.sessionDuration < 60000); // < 1 minute
    if (shortSessions.length > recentPatterns.length * 0.5) {
      threatLevel += 25;
      confidence += 25;
    }

    let prediction = 'Normal behavior';
    if (threatLevel > 50) prediction = 'High risk - potential account compromise';
    else if (threatLevel > 30) prediction = 'Medium risk - unusual patterns detected';
    else if (threatLevel > 10) prediction = 'Low risk - minor anomalies';

    return { threatLevel, prediction, confidence };
  }

  // Get user security insights
  static getUserInsights(userId: string): any {
    const profile = this.userProfiles.get(userId);
    const userPatterns = this.learningData.filter(p => p.userId === userId);
    
    if (!profile || userPatterns.length === 0) {
      return { message: 'No behavioral data available' };
    }

    const prediction = this.predictThreatLevel(userPatterns);
    
    return {
      profile,
      recentActivity: userPatterns.slice(-10),
      threatPrediction: prediction,
      riskFactors: this.identifyRiskFactors(userPatterns),
      recommendations: this.generateSecurityRecommendations(profile, prediction)
    };
  }

  // Identify risk factors
  private static identifyRiskFactors(patterns: LoginPattern[]): string[] {
    const risks: string[] = [];
    
    const uniqueLocations = new Set(patterns.map(p => p.geoLocation));
    if (uniqueLocations.size > 5) {
      risks.push('Multiple login locations');
    }
    
    const uniqueDevices = new Set(patterns.map(p => p.deviceFingerprint));
    if (uniqueDevices.size > 3) {
      risks.push('Multiple devices used');
    }
    
    const nightLogins = patterns.filter(p => p.timeOfDay < 6 || p.timeOfDay > 22);
    if (nightLogins.length > patterns.length * 0.3) {
      risks.push('Frequent off-hours access');
    }
    
    return risks;
  }

  // Generate security recommendations
  private static generateSecurityRecommendations(
    profile: BehaviorProfile, 
    prediction: any
  ): string[] {
    const recommendations: string[] = [];
    
    if (prediction.threatLevel > 50) {
      recommendations.push('Enable two-factor authentication');
      recommendations.push('Review recent account activity');
      recommendations.push('Change password immediately');
    } else if (prediction.threatLevel > 30) {
      recommendations.push('Consider enabling two-factor authentication');
      recommendations.push('Monitor account for unusual activity');
    }
    
    if (profile.typicalLocations.length > 3) {
      recommendations.push('Enable login notifications');
    }
    
    if (profile.typicalDevices.length > 2) {
      recommendations.push('Review trusted devices list');
    }
    
    return recommendations;
  }
}

export { AISecurityEngine, LoginPattern, BehaviorProfile }; 