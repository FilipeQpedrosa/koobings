"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Business, BusinessType, BusinessStatus, VerificationStatus } from '@prisma/client';
import BusinessVerificationForm from '@/components/admin/BusinessVerificationForm';
import { Input } from '@/components/ui/input';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    async function fetchBusiness() {
      setIsLoading(true);
      setError('');
      setSuccess('');
      try {
        const response = await fetch(`/api/admin/businesses/${params.id}`);
        if (!response.ok) {
          setError('Business not found.');
          setBusiness(null);
          return;
        }
        const data = await response.json();
        setBusiness(data);
        setSuccess('Business details loaded successfully!');
      } catch (error) {
        setError('Network or server error while fetching business details.');
        setBusiness(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBusiness();
  }, [params.id]);

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch(`/api/admin/businesses/${params.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to reset password');
      }
      setResetSuccess('Password reset successfully!');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setResetError(err.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{business?.name || 'Business Details'}</h1>
          <p className="text-gray-500">Business Details and Management</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      {/* Notifications */}
      {isLoading && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded">Loading business details...</div>
      )}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      {success && !isLoading && !error && business && (
        <div className="p-4 bg-green-100 text-green-800 rounded">{success}</div>
      )}

      {!isLoading && !error && business && (
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
              {/* Password Reset Form */}
              <form onSubmit={handlePasswordReset} className="max-w-md space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      minLength={8}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword(v => !v)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      minLength={8}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmNewPassword(v => !v)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                    >
                      {showConfirmNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                {resetError && <div className="text-red-600 text-sm">{resetError}</div>}
                {resetSuccess && <div className="text-green-600 text-sm">{resetSuccess}</div>}
                <Button type="submit" disabled={resetLoading}>
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 