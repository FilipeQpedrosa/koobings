'use client';
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const settingsTabs = [
  { label: 'General', href: '/staff/settings' },
  { label: 'Services', href: '/staff/settings/services' },
  { label: 'Staff', href: '/staff/settings/staff' },
  { label: 'Categories', href: '/staff/settings/categories' },
];

export default function StaffSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    allowStaffToViewAllBookings: false,
    restrictStaffToViewAllClients: false,
    restrictStaffToViewAllNotes: false,
    requireAdminCancelApproval: false,
  });
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading' || !session) return;
    if (
      session.user.staffRole !== 'ADMIN' &&
      !(session.user.permissions && session.user.permissions.includes('canViewSettings'))
    ) {
      router.replace('/staff/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchBusinessInfo() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/business/info');
        if (!response.ok) throw new Error('Failed to fetch business info');
        const data = await response.json();
        if (data.success) {
          setBusinessInfo({
            name: data.data.name || '',
            allowStaffToViewAllBookings: data.data.allowStaffToViewAllBookings || false,
            restrictStaffToViewAllClients: data.data.restrictStaffToViewAllClients || false,
            restrictStaffToViewAllNotes: data.data.restrictStaffToViewAllNotes || false,
            requireAdminCancelApproval: data.data.requireAdminCancelApproval || false,
          });
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchBusinessInfo();
  }, []);

  const handleToggleChange = (field: keyof typeof businessInfo) => {
    setBusinessInfo(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/business/info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessInfo),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save settings');
      }
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    if (session) {
      // Debug: log session object
      console.log('StaffSettingsPage session:', session);
    }
  }, [session]);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {settingsTabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-2 rounded whitespace-nowrap text-sm sm:text-base ${pathname === tab.href ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">General Settings</h2>
            <div className="flex items-center justify-between">
              <label htmlFor="allowStaffToViewAllBookings" className="text-sm font-medium">Allow staff to view all bookings</label>
              <Switch
                id="allowStaffToViewAllBookings"
                checked={businessInfo.allowStaffToViewAllBookings}
                onCheckedChange={() => handleToggleChange('allowStaffToViewAllBookings')}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <label htmlFor="restrictStaffToViewAllClients" className="text-sm font-medium">Restrict staff from viewing all clients</label>
              <Switch
                id="restrictStaffToViewAllClients"
                checked={businessInfo.restrictStaffToViewAllClients}
                onCheckedChange={() => handleToggleChange('restrictStaffToViewAllClients')}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <label htmlFor="restrictStaffToViewAllNotes" className="text-sm font-medium">Restrict staff from viewing all client notes</label>
              <Switch
                id="restrictStaffToViewAllNotes"
                checked={businessInfo.restrictStaffToViewAllNotes}
                onCheckedChange={() => handleToggleChange('restrictStaffToViewAllNotes')}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <label htmlFor="requireAdminCancelApproval" className="text-sm font-medium">Require admin approval for staff appointment cancellations</label>
              <Switch
                id="requireAdminCancelApproval"
                checked={businessInfo.requireAdminCancelApproval}
                onCheckedChange={() => handleToggleChange('requireAdminCancelApproval')}
              />
            </div>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 