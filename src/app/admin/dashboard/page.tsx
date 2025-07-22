'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Get cookies info
      const cookies = document.cookie;
      const adminToken = cookies.split(';').find(c => c.trim().startsWith('admin-auth-token='));
      
      setDebugInfo({
        hasCookies: !!cookies,
        hasAdminToken: !!adminToken,
        cookieValue: adminToken ? adminToken.split('=')[1].substring(0, 50) + '...' : 'Not found',
        allCookies: cookies
      });

      // Test admin API
      const response = await fetch('/api/admin/businesses', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      const data = await response.json();
      
      setAuthInfo({
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (response.ok) {
        // If auth works, redirect to businesses after 3 seconds
        setTimeout(() => {
          router.push('/admin/businesses');
        }, 3000);
      }

    } catch (error) {
      console.error('Auth check failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthInfo({
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🛠️ Admin Dashboard - Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cookie Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🍪 Cookie Information</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Has Cookies:</strong> {debugInfo.hasCookies ? '✅ Yes' : '❌ No'}</div>
              <div><strong>Has Admin Token:</strong> {debugInfo.hasAdminToken ? '✅ Yes' : '❌ No'}</div>
              <div><strong>Token Preview:</strong> {debugInfo.cookieValue}</div>
              <div className="mt-4">
                <strong>All Cookies:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                  {debugInfo.allCookies || 'None'}
                </pre>
              </div>
            </div>
          </div>

          {/* API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔌 API Test</h2>
            <div className="space-y-2 text-sm">
              {authInfo && (
                <>
                  <div><strong>Status:</strong> {authInfo.status}</div>
                  <div><strong>Success:</strong> {authInfo.ok ? '✅ Yes' : '❌ No'}</div>
                  {authInfo.error && (
                    <div><strong>Error:</strong> <span className="text-red-600">{authInfo.error}</span></div>
                  )}
                  {authInfo.data && (
                    <div className="mt-4">
                      <strong>Response:</strong>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(authInfo.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🎯 Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/businesses')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Businesses
            </button>
            <button
              onClick={() => window.location.href = '/auth/admin-signin'}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Login
            </button>
            <button
              onClick={checkAuth}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Auth Again
            </button>
          </div>
        </div>

        {authInfo?.ok && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ Authentication successful! Redirecting to businesses page in 3 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 