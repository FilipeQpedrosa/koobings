'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function PatientSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';

    try {
      const result = await signIn('patient-login', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your appointments and profile
        </p>
      </div>
      <div className="mt-8">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                name="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
              )}
              Sign In
            </Button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/patient/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
} 