'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { getBusinessWithFeatures } from '@/lib/business';

interface BusinessData {
  id: string;
  name: string;
  slug: string | null;
  logo?: string | null;
  settings?: any;
}

export default function BusinessSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const businessSlug = params.businessSlug as string;

  // Load business data
  useEffect(() => {
    async function loadBusiness() {
      try {
        const businessData = await getBusinessWithFeatures(businessSlug);
        if (businessData) {
          setBusiness(businessData);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        console.error('Error loading business:', err);
        setError('Failed to load business information');
      } finally {
        setBusinessLoading(false);
      }
    }

    if (businessSlug) {
      loadBusiness();
    }
  }, [businessSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
        // Redirect to the URL provided by the API
        router.push(data.redirectUrl || `/${businessSlug}/staff/dashboard`);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert>
              <AlertDescription>
                {error || 'Business not found'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              {business.logo ? (
                <img 
                  src={business.logo} 
                  alt={`${business.name} logo`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {business.name}
            </CardTitle>
            <CardDescription>
              Sign in to your staff portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert>
                  <AlertDescription>
                    <span className="text-red-600">{error}</span>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 