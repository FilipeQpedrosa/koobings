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
        body: JSON.stringify({ 
          email, 
          password,
          businessSlug: businessSlug // 🚨 CRITICAL FIX: Send specific business slug
        }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 text-center pt-8 pb-6">
            {/* Enhanced Logo Section */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                {business.logo ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                    <img 
                      src={business.logo} 
                      alt={`${business.name} logo`}
                      className="relative h-24 w-24 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                    <div className="relative h-24 w-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-xl border-4 border-white">
                      <Building2 className="h-12 w-12 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Business Name with Brand Styling */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {business.name}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 font-medium">
                Portal Staff
              </CardDescription>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto"></div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a sua password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription>
                    <span className="text-red-700 font-medium">{error}</span>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>A entrar...</span>
                  </div>
                ) : (
                  'Entrar no Portal'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 