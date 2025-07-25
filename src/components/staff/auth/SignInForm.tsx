import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Staff login attempt for:', email);
      
      // Clear any existing auth data before attempting login
      localStorage.removeItem('auth-refresh');
      localStorage.removeItem('user-session');
      sessionStorage.clear();
      
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Staff login successful, forcing complete refresh');
        
        // Trigger auth refresh in other components/tabs with timestamp
        const refreshToken = Date.now().toString();
        localStorage.setItem('auth-refresh', refreshToken);
        
        // Dispatch storage event for immediate cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'auth-refresh',
          newValue: refreshToken
        }));

        // Force complete page refresh to ensure no old data remains
        // This is more reliable than router navigation for session changes
        console.log('🔄 Forcing complete page refresh to clear any cached state');
        
        // Small delay to ensure backend state is synchronized
        setTimeout(() => {
          // Use window.location.href for complete refresh instead of router.push
          window.location.href = data.redirectUrl || '/staff/dashboard';
        }, 200);
        
      } else {
        console.error('❌ Staff login failed:', data.error);
        setError(data.error || 'Invalid email or password');
        
        // Clear any partial auth data on failed login
        localStorage.removeItem('auth-refresh');
        sessionStorage.clear();
      }
    } catch (err) {
      console.error('❌ Staff login network error:', err);
      setError('An error occurred. Please try again.');
      
      // Clear any partial auth data on error
      localStorage.removeItem('auth-refresh');
      sessionStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
} 