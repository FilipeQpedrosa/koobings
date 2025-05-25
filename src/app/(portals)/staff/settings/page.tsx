'use client';
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsTabs = [
  { label: 'General', href: '/staff/settings' },
  { label: 'Services', href: '/staff/settings/services' },
  { label: 'Staff', href: '/staff/settings/staff' },
  { label: 'Categories', href: '/staff/settings/categories' },
];

export default function StaffSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [restrictClients, setRestrictClients] = useState(false);
  const [restrictNotes, setRestrictNotes] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/staff/settings');
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
    fetchSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/staff/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex gap-2 mb-6">
        {settingsTabs.map(tab => (
          <Link key={tab.href} href={tab.href} legacyBehavior>
            <a className={`px-4 py-2 rounded ${pathname === tab.href ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{tab.label}</a>
          </Link>
        ))}
      </div>
      {loading ? (
        <div>Loading settings...</div>
      ) : (
        <>
          <div className="mb-6">
            <label className="flex items-center gap-4 mb-2">
              <Switch checked={restrictClients} onCheckedChange={setRestrictClients} />
              Restrict staff to only view their own clients
            </label>
            <label className="flex items-center gap-4 mb-2">
              <Switch checked={restrictNotes} onCheckedChange={setRestrictNotes} />
              Restrict staff to only view their own notes
            </label>
            <Button onClick={handleSave} disabled={saving} className="mt-2">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>
          <p>Select a settings section from the tabs above.</p>
        </>
      )}
    </div>
  );
} 