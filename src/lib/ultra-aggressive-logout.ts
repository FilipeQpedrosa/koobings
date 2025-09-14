// ULTRA-AGGRESSIVE LOGOUT SYSTEM
// Forces logout on: tab close, browser close, 15min inactivity
// Designed for MAXIMUM SECURITY

export class UltraAggressiveLogout {
  private static instance: UltraAggressiveLogout;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  private isLoggedOut = false;

  private constructor() {
    this.setupEventListeners();
    this.startInactivityMonitor();
  }

  static getInstance(): UltraAggressiveLogout {
    if (!UltraAggressiveLogout.instance) {
      UltraAggressiveLogout.instance = new UltraAggressiveLogout();
    }
    return UltraAggressiveLogout.instance;
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return;

    console.log('🔒 [ULTRA_LOGOUT] Setting up ultra-aggressive logout system...');

    // 1. DETECT TAB/BROWSER CLOSE
    window.addEventListener('beforeunload', (event) => {
      console.log('🚨 [ULTRA_LOGOUT] Tab/Browser closing - FORCE LOGOUT!');
      this.executeImmediateLogout('TAB_BROWSER_CLOSE');
    });

    // 2. DETECT PAGE UNLOAD (backup)
    window.addEventListener('unload', () => {
      console.log('🚨 [ULTRA_LOGOUT] Page unloading - FORCE LOGOUT!');
      this.executeImmediateLogout('PAGE_UNLOAD');
    });

    // 3. DETECT PAGE VISIBILITY CHANGE (tab switch/minimize)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('🔒 [ULTRA_LOGOUT] Tab hidden - checking for potential close...');
        // Give a small delay to detect if it's actually closing
        setTimeout(() => {
          if (document.hidden && !this.isLoggedOut) {
            console.log('🚨 [ULTRA_LOGOUT] Tab still hidden - potential close detected!');
            this.executeImmediateLogout('TAB_HIDDEN_EXTENDED');
          }
        }, 2000);
      } else {
        console.log('✅ [ULTRA_LOGOUT] Tab visible again - user returned');
        this.updateActivity();
      }
    });

    // 4. DETECT USER ACTIVITY FOR INACTIVITY MONITORING
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'focus', 'blur'
    ];

    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      }, { passive: true });
    });

    // 5. DETECT NETWORK DISCONNECT
    window.addEventListener('offline', () => {
      console.log('🚨 [ULTRA_LOGOUT] Network disconnected - FORCE LOGOUT!');
      this.executeImmediateLogout('NETWORK_DISCONNECT');
    });

    // 6. DETECT BROWSER TAB FOCUS LOSS (additional security)
    window.addEventListener('blur', () => {
      console.log('🔒 [ULTRA_LOGOUT] Window lost focus');
      // Start aggressive monitoring when window loses focus
      setTimeout(() => {
        if (!document.hasFocus() && !this.isLoggedOut) {
          console.log('🚨 [ULTRA_LOGOUT] Extended focus loss - potential security risk!');
        }
      }, 5000);
    });
  }

  private updateActivity() {
    this.lastActivity = Date.now();
    console.log('🔄 [ULTRA_LOGOUT] Activity detected - resetting inactivity timer');
    this.resetInactivityTimer();
  }

  private startInactivityMonitor() {
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      console.log('🚨 [ULTRA_LOGOUT] 15 MINUTES INACTIVITY - FORCE LOGOUT!');
      this.executeImmediateLogout('INACTIVITY_TIMEOUT');
    }, this.INACTIVITY_TIMEOUT);
  }

  private async executeImmediateLogout(reason: string) {
    if (this.isLoggedOut) {
      console.log('🔒 [ULTRA_LOGOUT] Already logged out, skipping...');
      return;
    }

    this.isLoggedOut = true;
    console.log(`🚨 [ULTRA_LOGOUT] EXECUTING IMMEDIATE LOGOUT - Reason: ${reason}`);

    try {
      // 1. Clear all local storage
      localStorage.clear();
      sessionStorage.clear();

      // 2. Call logout API (with minimal timeout for immediate effect)
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 1000); // 1 second max

      fetch('/api/auth/force-logout-all-devices', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason, timestamp: new Date().toISOString() })
      }).catch(error => {
        console.log('🔒 [ULTRA_LOGOUT] Logout API call failed (expected for immediate logout):', error);
      });

      // 3. Clear all cookies aggressively (client-side)
      this.clearAllCookies();

      // 4. Dispatch logout event for other components
      window.dispatchEvent(new CustomEvent('ultra-aggressive-logout', { 
        detail: { reason, timestamp: new Date().toISOString() } 
      }));

      // 5. Set logout flag in localStorage for other tabs
      localStorage.setItem('ultra-logout-executed', Date.now().toString());

      console.log('✅ [ULTRA_LOGOUT] Immediate logout executed successfully');

    } catch (error) {
      console.error('❌ [ULTRA_LOGOUT] Error during immediate logout:', error);
    }
  }

  private clearAllCookies() {
    // Get all cookies and clear them
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Clear for current domain
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });

    console.log('🍪 [ULTRA_LOGOUT] All cookies cleared aggressively');
  }

  // Public method to start monitoring for a logged-in user
  public startMonitoring() {
    console.log('🚀 [ULTRA_LOGOUT] Starting ultra-aggressive logout monitoring...');
    this.isLoggedOut = false;
    this.updateActivity();
  }

  // Public method to stop monitoring (when user logs out normally)
  public stopMonitoring() {
    console.log('⏹️ [ULTRA_LOGOUT] Stopping logout monitoring - normal logout');
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    this.isLoggedOut = true;
  }

  // Get remaining time before inactivity logout
  public getRemainingTime(): number {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    const remaining = this.INACTIVITY_TIMEOUT - timeSinceLastActivity;
    return Math.max(0, remaining);
  }

  // Check if user will be logged out soon (within 2 minutes)
  public isInactivityWarningNeeded(): boolean {
    const remaining = this.getRemainingTime();
    return remaining > 0 && remaining <= 2 * 60 * 1000; // 2 minutes warning
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  // Listen for storage changes from other tabs
  window.addEventListener('storage', (event) => {
    if (event.key === 'ultra-logout-executed') {
      console.log('🚨 [ULTRA_LOGOUT] Logout detected from another tab - logging out this tab too!');
      window.location.href = '/';
    }
  });
}

export default UltraAggressiveLogout; 