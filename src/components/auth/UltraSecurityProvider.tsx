'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UltraAggressiveLogout } from '@/lib/ultra-aggressive-logout';

interface UltraSecurityContextType {
  remainingTime: number;
  isWarningShown: boolean;
  extendSession: () => void;
  forceLogout: () => void;
}

const UltraSecurityContext = createContext<UltraSecurityContextType | null>(null);

interface UltraSecurityProviderProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

export function UltraSecurityProvider({ children, isLoggedIn }: UltraSecurityProviderProps) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [logoutSystem] = useState(() => {
    console.log('🔧 [ULTRA_SECURITY] Creating UltraAggressiveLogout instance...');
    return UltraAggressiveLogout.getInstance();
  });

  console.log(`🔍 [ULTRA_SECURITY] UltraSecurityProvider render - isLoggedIn: ${isLoggedIn}`);

  useEffect(() => {
    console.log(`🔄 [ULTRA_SECURITY] Login state changed - isLoggedIn: ${isLoggedIn}`);
    
    if (isLoggedIn) {
      console.log('🚀 [ULTRA_SECURITY] User logged in - starting ultra-aggressive monitoring');
      logoutSystem.startMonitoring();
    } else {
      console.log('⏹️ [ULTRA_SECURITY] User logged out - stopping monitoring');
      logoutSystem.stopMonitoring();
    }
  }, [isLoggedIn, logoutSystem]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('🔒 [ULTRA_SECURITY] User not logged in - skipping monitoring setup');
      return;
    }

    console.log('⏰ [ULTRA_SECURITY] Setting up inactivity monitoring...');

    // Update remaining time every 30 seconds
    const timeInterval = setInterval(() => {
      const remaining = logoutSystem.getRemainingTime();
      setRemainingTime(remaining);
      
      const needsWarning = logoutSystem.isInactivityWarningNeeded();
      setIsWarningShown(needsWarning);
      
      if (needsWarning) {
        console.log(`⚠️ [ULTRA_SECURITY] Inactivity warning: ${Math.floor(remaining / 1000 / 60)} minutes remaining`);
      }
      
      console.log(`⏱️ [ULTRA_SECURITY] Time check - remaining: ${Math.floor(remaining / 1000 / 60)}:${Math.floor((remaining / 1000) % 60)}`);
    }, 30000);

    // Listen for ultra-aggressive logout events
    const handleUltraLogout = (event: CustomEvent) => {
      console.log('🚨 [ULTRA_SECURITY] Ultra-aggressive logout triggered:', event.detail);
      window.location.href = '/';
    };

    window.addEventListener('ultra-aggressive-logout', handleUltraLogout as EventListener);
    console.log('👂 [ULTRA_SECURITY] Event listeners setup complete');

    return () => {
      console.log('🧹 [ULTRA_SECURITY] Cleaning up monitoring...');
      clearInterval(timeInterval);
      window.removeEventListener('ultra-aggressive-logout', handleUltraLogout as EventListener);
    };
  }, [isLoggedIn, logoutSystem]);

  const extendSession = () => {
    console.log('🔄 [ULTRA_SECURITY] Session extended by user action');
    // The system automatically detects activity, but we can also manually reset
    logoutSystem.startMonitoring();
    setIsWarningShown(false);
  };

  const forceLogout = async () => {
    console.log('🚨 [ULTRA_SECURITY] Manual force logout triggered');
    try {
      await fetch('/api/auth/force-logout-all-devices', { method: 'POST' });
      logoutSystem.stopMonitoring();
      window.location.href = '/';
    } catch (error) {
      console.error('❌ [ULTRA_SECURITY] Force logout failed:', error);
    }
  };

  const value: UltraSecurityContextType = {
    remainingTime,
    isWarningShown,
    extendSession,
    forceLogout
  };

  return (
    <UltraSecurityContext.Provider value={value}>
      {children}
      {isWarningShown && <InactivityWarning onExtend={extendSession} remainingTime={remainingTime} />}
    </UltraSecurityContext.Provider>
  );
}

interface InactivityWarningProps {
  onExtend: () => void;
  remainingTime: number;
}

function InactivityWarning({ onExtend, remainingTime }: InactivityWarningProps) {
  const minutes = Math.floor(remainingTime / 1000 / 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  console.log('⚠️ [ULTRA_SECURITY] InactivityWarning rendered');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl border border-red-200">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              ⚠️ Aviso de Inatividade
            </h3>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            A sua sessão expirará em <strong className="text-red-600">{minutes}:{seconds.toString().padStart(2, '0')}</strong> devido à inatividade.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Para continuar, clique em "Continuar Sessão".
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onExtend}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            🔄 Continuar Sessão
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            🚪 Sair Agora
          </button>
        </div>
      </div>
    </div>
  );
}

export function useUltraSecurity() {
  const context = useContext(UltraSecurityContext);
  if (!context) {
    throw new Error('useUltraSecurity must be used within UltraSecurityProvider');
  }
  return context;
} 