'use client';

import { useState, useEffect } from 'react';

export default function TestLogoutDebug() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkAuthStatus = async () => {
    try {
      addLog('🔍 Checking auth status...');
      const response = await fetch('/api/customer/profile', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache'
      });
      
      addLog(`👤 Auth check response: ${response.status}`);
      
      if (response.status === 200) {
        const data = await response.json();
        addLog(`✅ User logged in: ${data.data?.name} (${data.data?.email})`);
        setIsLoggedIn(true);
        return true;
      } else {
        addLog(`❌ User not logged in (${response.status})`);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      addLog(`❌ Auth check error: ${error}`);
      setIsLoggedIn(false);
      return false;
    }
  };

  const performLogout = async () => {
    try {
      addLog('🚪 Starting logout...');
      
      // Clear local state first
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('user_logged_out', 'true');
      addLog('🧹 Local storage cleared');
      
      // Call logout API
      const response = await fetch('/api/auth/client/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache'
      });
      
      addLog(`🚪 Logout API response: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Logout API success: ${data.message}`);
      } else {
        addLog(`❌ Logout API failed: ${response.status}`);
      }
      
      // Dispatch logout events
      window.dispatchEvent(new CustomEvent('customer-logout'));
      addLog('📡 Logout events dispatched');
      
      // Wait and check auth again
      setTimeout(async () => {
        addLog('⏱️ Checking auth after logout...');
        const stillLoggedIn = await checkAuthStatus();
        
        if (stillLoggedIn) {
          addLog('🚨 PROBLEM: Still logged in after logout!');
        } else {
          addLog('✅ SUCCESS: Properly logged out');
        }
      }, 1000);
      
    } catch (error) {
      addLog(`❌ Logout error: ${error}`);
    }
  };

  const checkCookies = () => {
    addLog('🍪 Current cookies:');
    const cookies = document.cookie.split(';');
    if (cookies.length === 1 && cookies[0] === '') {
      addLog('   No cookies found');
    } else {
      cookies.forEach(cookie => {
        addLog(`   ${cookie.trim()}`);
      });
    }
  };

  const checkStorage = () => {
    addLog('💾 LocalStorage contents:');
    if (localStorage.length === 0) {
      addLog('   No localStorage items');
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          addLog(`   ${key}: ${localStorage.getItem(key)}`);
        }
      }
    }
  };

  const clearAllDebug = () => {
    setLogs([]);
  };

  useEffect(() => {
    addLog('🚀 Debug page loaded');
    checkAuthStatus();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🐛 Logout Debug Tool</h1>
      
      <div className="grid gap-4 mb-6">
        <div className="flex gap-2">
          <button 
            onClick={checkAuthStatus}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🔍 Check Auth Status
          </button>
          <button 
            onClick={performLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={!isLoggedIn}
          >
            🚪 Perform Logout
          </button>
          <button 
            onClick={checkCookies}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            🍪 Check Cookies
          </button>
          <button 
            onClick={checkStorage}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            💾 Check Storage
          </button>
          <button 
            onClick={clearAllDebug}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            🧹 Clear Logs
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Status:</strong> {
            isLoggedIn === null ? '⏳ Checking...' : 
            isLoggedIn ? '✅ Logged In' : '❌ Logged Out'
          }</p>
        </div>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
        <h3 className="text-white mb-2">📋 Debug Logs:</h3>
        {logs.map((log, index) => (
          <div key={index} className="mb-1">{log}</div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500">No logs yet...</div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ol className="list-decimal list-inside">
          <li>First, check your auth status</li>
          <li>If logged in, click "Perform Logout"</li>
          <li>Watch the logs to see what happens</li>
          <li>Check cookies and storage to debug issues</li>
        </ol>
      </div>
    </div>
  );
} 