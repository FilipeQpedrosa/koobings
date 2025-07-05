'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('🔐 [SignIn] Attempting login with:', { email });

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: 'staff',
        redirect: false,
      });

      console.log('🔐 [SignIn] Login result:', result);

      if (result?.error) {
        console.log('❌ [SignIn] Login error:', result.error);
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        console.log('✅ [SignIn] Login successful, redirecting...');
        
        // Get the callback URL from search params
        const callbackUrl = searchParams.get('callbackUrl');
        
        if (callbackUrl) {
          console.log('🔄 [SignIn] Redirecting to callback URL:', callbackUrl);
          window.location.href = callbackUrl;
        } else {
          console.log('🔄 [SignIn] No callback URL, redirecting to /staff/dashboard');
          // Let the middleware handle the redirect to business-specific URL
          window.location.href = '/staff/dashboard';
        }
      }
    } catch (error) {
      console.error('❌ [SignIn] Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your staff account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-password">Password</Label>
            <Input
              id="staff-password"
              name="password"
              type="password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="text-center text-sm">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? Contact your administrator
          </p>
        </div>
      </Card>
    </div>
  );
} 