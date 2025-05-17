'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessType } from '@prisma/client';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.OTHER);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, role: 'staff' | 'business') => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;
    const businessId = formData.get('businessId') as string;

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = role === 'staff' 
        ? '/api/auth/register/staff'
        : '/api/auth/register/business';

      const body = role === 'staff'
        ? { email, password, name, businessId }
        : { email, password, name, type: businessType };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      toast({
        title: 'Success',
        description: 'Registration successful! Please sign in.',
      });

      router.push('/auth/signin');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-500">Sign up to get started</p>
        </div>

        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="staff">
            <form onSubmit={(e) => handleSubmit(e, 'staff')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Full Name</Label>
                <Input
                  id="staff-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
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
                <Label htmlFor="staff-business-id">Business ID</Label>
                <Input
                  id="staff-business-id"
                  name="businessId"
                  type="text"
                  placeholder="Enter your business ID"
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
              <div className="space-y-2">
                <Label htmlFor="staff-confirm-password">Confirm Password</Label>
                <Input
                  id="staff-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="business">
            <form onSubmit={(e) => handleSubmit(e, 'business')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  name="name"
                  type="text"
                  placeholder="Your Business Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Select
                  value={businessType}
                  onValueChange={(value) => setBusinessType(value as BusinessType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BusinessType.HAIR_SALON}>Hair Salon</SelectItem>
                    <SelectItem value={BusinessType.BARBERSHOP}>Barbershop</SelectItem>
                    <SelectItem value={BusinessType.NAIL_SALON}>Nail Salon</SelectItem>
                    <SelectItem value={BusinessType.PHYSIOTHERAPY}>Physiotherapy</SelectItem>
                    <SelectItem value={BusinessType.PSYCHOLOGY}>Psychology</SelectItem>
                    <SelectItem value={BusinessType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Business Email</Label>
                <Input
                  id="business-email"
                  name="email"
                  type="email"
                  placeholder="business@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-password">Password</Label>
                <Input
                  id="business-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-confirm-password">Confirm Password</Label>
                <Input
                  id="business-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => router.push('/auth/signin')}
            >
              Sign in
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
} 