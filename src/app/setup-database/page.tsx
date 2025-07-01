'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SetupDatabasePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const initializeDatabase = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      setResult({ error: { message: 'Failed to connect to the server' } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Database Setup
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Initialize your service scheduler database with admin users
          </p>
        </div>

        {status === 'idle' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This will create the initial admin users for your application:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Super Admin: f.queirozpedrosa@gmail.com</li>
              <li>System Admin: admin@example.com</li>
              <li>Business Admin: sandra@gmail.com</li>
            </ul>
            <p className="text-xs text-gray-500">
              Default password for all accounts: <strong>admin123</strong>
            </p>
            <Button onClick={initializeDatabase} className="w-full">
              Initialize Database
            </Button>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Setting up database...</p>
          </div>
        )}

        {status === 'success' && result?.data && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-800">
                ✅ Database initialized successfully!
              </h3>
              <p className="text-sm text-green-600 mt-1">
                {result.data.message}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Admin Accounts Created:</h4>
              {result.data.admins?.map((admin: any, index: number) => (
                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                  <div><strong>Email:</strong> {admin.email}</div>
                  <div><strong>Password:</strong> {admin.password}</div>
                  <div><strong>Role:</strong> {admin.role}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.location.href = result.data.loginUrl}
                className="w-full"
              >
                Go to Admin Login
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Setup failed
              </h3>
              <p className="text-sm text-red-600 mt-1">
                {result?.error?.message || 'An unknown error occurred'}
              </p>
              {result?.error?.code === 'ALREADY_INITIALIZED' && (
                <p className="text-sm text-red-600 mt-2">
                  The database is already set up. You can proceed to login.
                </p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => setStatus('idle')}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/auth/admin-signin'}
                className="flex-1"
              >
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 