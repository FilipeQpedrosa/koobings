'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLogin() {
  const [email, setEmail] = useState('barbeariaorlando15@gmail.com');
  const [password, setPassword] = useState('orlando123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        alert(`Login successful! Redirecting to: ${data.redirectUrl}`);
        console.log('Login successful:', data.user);
        console.log('Redirecting to:', data.redirectUrl);
        
        // Redirect to the URL provided by the server
        setTimeout(() => {
          router.push(data.redirectUrl);
        }, 2000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify-token');
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
        console.log('User authenticated:', data.user);
      } else {
        console.log('User not authenticated');
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🧪 Test Login System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Testing our custom authentication
          </p>
        </div>
        
        {!user ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-green-800">✅ Login Successful!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Business:</strong> {user.businessName}</p>
              <p><strong>Staff Role:</strong> {user.staffRole}</p>
              <p><strong>Is Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
            </div>
            <p className="mt-2 text-sm text-green-600">
              Redirecting to dashboard in 2 seconds...
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={checkAuth}
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            🔍 Check Current Auth Status
          </button>
        </div>
      </div>
    </div>
  );
} 