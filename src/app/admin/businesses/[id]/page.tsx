'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Business, BusinessType, BusinessStatus, VerificationStatus } from '@prisma/client';
import BusinessVerificationForm from '@/components/admin/BusinessVerificationForm';

interface BusinessDetails extends Business {
  verification: {
    id: string;
    status: VerificationStatus;
    submittedAt: string;
    verifiedAt: string | null;
    notes: string | null;
  } | null;
  _count: {
    patients: number;
    staff: number;
    services: number;
  };
}

export default function BusinessDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const response = await fetch(`/api/admin/businesses/${params.id}`);
        if (!response.ok) {
          throw new Error('Business not found');
        }
        const data = await response.json();
        setBusiness(data);
      } catch (error) {
        console.error('Error fetching business:', error);
        router.push('/admin/businesses');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBusiness();
  }, [params.id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-gray-500">Business Details and Management</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Business Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(business.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.address || 'Not provided'}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Statistics</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {business._count.patients}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Staff Members</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {business._count.staff}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Services Offered</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {business._count.services}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card className="p-6">
            <BusinessVerificationForm business={business} />
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Business Settings</h2>
            <p className="text-gray-500">Coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 