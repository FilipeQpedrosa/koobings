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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [restrictClients, setRestrictClients] = useState(false);
  const [restrictNotes, setRestrictNotes] = useState(false);
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
    async function fetchSettings() {
      setLoading(true);
      setError('');
      try {
        const businessId = session?.user?.businessId || '';
        const res = await fetch('/api/staff/settings', {
          headers: {
            'x-business-id': businessId,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setRestrictClients(!!data.restrictStaffToViewAllClients);
        setRestrictNotes(!!data.restrictStaffToViewAllNotes);
      } catch (err: any) {
        setError(err.message || 'Error fetching settings');
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchSettings();
  }, [session]);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const businessId = session?.user?.businessId || '';
      const res = await fetch('/api/staff/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-business-id': businessId,
        },
        body: JSON.stringify({
          restrictStaffToViewAllClients: restrictClients,
          restrictStaffToViewAllNotes: restrictNotes,
        }),
      });
      if (!res.ok) throw new Error('Failed to update settings');
    } catch (err: any) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  }

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
      {loading ? (
        <div>Loading settings...</div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4">
            <label className="flex items-center gap-3 sm:gap-4 mb-2 text-sm sm:text-base">
              <Switch checked={restrictClients} onCheckedChange={setRestrictClients} />
              <span>
                Restrict staff to only view their own clients
                <p className="text-xs text-gray-500 mt-1">
                  When enabled, staff members will only be able to see clients that are assigned to them. They will not be able to view other staff members' clients.
                </p>
              </span>
            </label>
            <label className="flex items-center gap-3 sm:gap-4 mb-2 text-sm sm:text-base">
              <Switch checked={restrictNotes} onCheckedChange={setRestrictNotes} />
              <span>
                Restrict staff to only view their own notes
                <p className="text-xs text-gray-500 mt-1">
                  When enabled, staff members will only be able to see notes that they have created. They will not be able to view notes created by other staff members.
                </p>
              </span>
            </label>
            <Button onClick={handleSave} disabled={saving} className="mt-2 w-full sm:w-auto">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>
          <p className="text-sm sm:text-base">Select a settings section from the tabs above.</p>
        </>
      )}
    </div>
  );
} 