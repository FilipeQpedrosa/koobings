'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function AdminSignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useSearchParams(); // Just call the hook without assigning
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // If user is already logged in as staff, redirect them away
    if (status === 'authenticated' && session?.user?.role === 'STAFF') {
      console.log('🚨 STAFF USER DETECTED ON ADMIN LOGIN PAGE');
      console.log('🚨 User:', session.user.email);
      console.log('🚨 Redirecting to staff dashboard...');
      
      // Find their business and redirect
      if (session.user.businessId === 'cmckxlexv0000js04ehmx88dq') {
        router.push('/barbearia-orlando/staff/dashboard');
      } else if (session.user.businessId === 'cmckxlgcd0004js04sh2db333') {
        router.push('/ju-unha/staff/dashboard');
      } else {
        router.push('/staff/dashboard');
      }
      return;
    }
    
    // If user is already logged in as admin, redirect to admin dashboard
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      console.log('✅ ADMIN USER DETECTED - Redirecting to admin dashboard');
      router.push('/admin/dashboard');
      return;
    }
    
    // If not authenticated or loading, show the form
    if (status === 'unauthenticated' || status === 'loading') {
      setShowForm(true);
    }
  }, [session, status, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('🔑 Admin login attempt:', { email, role: 'ADMIN' });

    // CLIENT-SIDE SECURITY CHECK
    if (email !== 'f.queirozpedrosa@gmail.com') {
      console.log('❌ CLIENT-SIDE SECURITY VIOLATION: Unauthorized email');
      console.log('❌ Email:', email);
      console.log('❌ Only f.queirozpedrosa@gmail.com can access admin portal');
      
      toast({
        title: 'Acesso Negado',
        description: 'Apenas administradores autorizados podem aceder ao portal admin.',
        variant: 'destructive',
      });
      
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: 'ADMIN',
        redirect: false,
      });

      console.log('🔍 SignIn result:', result);

      if (result?.error) {
        console.error('❌ SignIn error:', result.error);
        toast({
          title: 'Error',
          description: `Authentication failed: ${result.error}`,
          variant: 'destructive',
        });
        return;
      }

      if (result?.ok) {
        console.log('✅ Login successful, redirecting...');
        router.push('/admin/dashboard');
      } else {
        console.error('❌ Login failed without specific error');
        toast({
          title: 'Error',
          description: 'Login failed. Please check your credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (status === 'loading' || !showForm) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Verificando acesso...</h1>
            <p className="text-gray-500">Por favor aguarde</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-500">Sign in to your admin account</p>
          <p className="text-xs text-red-500">⚠️ Apenas para administradores autorizados</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
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
      </Card>
    </div>
  );
} 