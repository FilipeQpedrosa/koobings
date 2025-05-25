"use client";
// This page must be a Client Component because it uses React hooks (useEffect, useState, useSession)
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [allowAllBookings, setAllowAllBookings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchSetting() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/business/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setAllowAllBookings(data.allowStaffToViewAllBookings);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    }
    fetchSetting();
  }, []);

  async function handleToggle(value: boolean) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/business/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowStaffToViewAllBookings: value }),
      });
      if (!res.ok) throw new Error('Failed to update setting');
      setAllowAllBookings(value);
      setSuccess('Setting updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
  }

  // Only show to admins/owners
  if (session?.user?.staffRole !== 'ADMIN') {
    return <div className="p-8">You do not have permission to view settings.</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center justify-between bg-white p-4 rounded shadow">
        <div>
          <div className="font-medium">Allow staff to view all bookings</div>
          <div className="text-gray-500 text-sm">If enabled, all staff can see all bookings. If disabled, staff only see their own bookings.</div>
        </div>
        <Switch checked={allowAllBookings} onCheckedChange={handleToggle} disabled={loading || saving} />
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
    </div>
  );
} 