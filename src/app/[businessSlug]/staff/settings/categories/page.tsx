"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function StaffSettingsCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const businessSlug = user?.businessSlug;

  useEffect(() => {
    if (authLoading) return;
    
    if (!businessSlug) {
      console.error('Business slug not available');
      return;
    }
    
    // Initialize data loading here
  }, [authLoading, businessSlug]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!businessSlug) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Business Information Missing</h3>
          <p className="text-red-600">Unable to load business settings. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/${businessSlug}/staff/settings`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Organize your services into categories</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Categories Management
          </CardTitle>
          <CardDescription>
            Organize your services with categories
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            Category management functionality will be available in a future update.
          </p>
          <p className="text-sm text-gray-400">
            For now, services are managed without categories in the Services section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 