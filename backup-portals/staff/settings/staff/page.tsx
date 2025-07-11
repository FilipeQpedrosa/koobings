"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  services?: { id: string; name: string }[];
  permissions?: string[];
}

interface Service {
  id: string;
  name: string;
}

const STAFF_ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'STANDARD', label: 'Standard' },
];

const settingsTabs = [
  { label: 'General', href: '/staff/settings' },
  { label: 'Services', href: '/staff/settings/services' },
  { label: 'Staff', href: '/staff/settings/staff' },
  { label: 'Categories', href: '/staff/settings/categories' },
];

export default function StaffSettingsStaffPage() {
  const { user, loading: authLoading, authenticated } = useAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'STANDARD', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const pathname = usePathname();

  // Add debug logs for state changes
  useEffect(() => {
    console.log('🔄 Staff state changed:', { count: staff.length, staff });
  }, [staff]);

  useEffect(() => {
    console.log('🔄 Loading state changed:', { isLoading, authLoading, authenticated });
  }, [isLoading, authLoading, authenticated]);

  useEffect(() => {
    if (authLoading || !authenticated) return;
    if (
      user?.role !== 'BUSINESS_OWNER' &&
      user?.staffRole !== 'ADMIN' &&
      !(user?.permissions && user.permissions.includes('canViewSettings'))
    ) {
      router.replace('/staff/dashboard');
    }
  }, [user, authLoading, authenticated, router]);

  useEffect(() => {
    console.log('🚀 Component mounted, fetching staff...');
    fetchStaff();
  }, []);

  // Additional useEffect to refetch if user changes
  useEffect(() => {
    if (authenticated && user) {
      console.log('👤 User authenticated, refetching staff...', user);
      fetchStaff();
    }
  }, [authenticated, user]);

  async function fetchStaff() {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching staff members...');
      const response = await fetch('/api/business/staff');
      console.log('📡 Staff API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Staff API error:', errorText);
        throw new Error('Failed to fetch staff');
      }
      
      const data = await response.json();
      console.log('📊 Staff API response data:', data);
      console.log('👥 Staff array:', data.data);
      console.log('🔢 Staff count:', data.data?.length || 0);
      
      setStaff(data.data || []);
    } catch (err) {
      console.error('🚨 Error fetching staff:', err);
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.data);
    } catch (err) {
      setServices([]);
    }
  }

  function openAddModal() {
    setEditId(null);
    setForm({ name: '', email: '', role: 'STANDARD', password: '' });
    setSelectedServices([]);
    setShowModal(true);
    fetchServices();
  }

  function openEditModal(member: StaffMember) {
    setEditId(member.id);
    setForm({ name: member.name, email: member.email, role: member.role, password: '' });
    setSelectedServices(member.services ? member.services.map(s => s.id) : []);
    setShowModal(true);
    fetchServices();
  }

  async function handleAddOrEditStaff(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      let response;
      const payload = { ...form, services: selectedServices };
      if (editId) {
        response = await fetch(`/api/business/staff/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/business/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save staff');
      }
      setShowModal(false);
      setForm({ name: '', email: '', role: 'STANDARD', password: '' });
      setEditId(null);
      setSelectedServices([]);
      fetchStaff();
    } catch (err: any) {
      setError(err.message || 'Failed to save staff');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteStaff(id: string) {
    console.log('handleDeleteStaff called with id:', id);
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/business/staff/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete staff');
      }
      setShowDeleteId(null);
      fetchStaff();
    } catch (err: any) {
      setError(err.message || 'Failed to delete staff');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading while auth is still being checked
  if (authLoading) {
    return <div className="p-8">Loading...</div>;
  }

  // Only show to admin staff
  if (!authenticated || (user?.role !== 'BUSINESS_OWNER' && user?.staffRole !== 'ADMIN')) {
    console.log('🚫 Access denied:', { authenticated, userRole: user?.role, userStaffRole: user?.staffRole, user });
    return <div className="p-8">You do not have permission to manage staff.</div>;
  }

  console.log('✅ Access granted, rendering staff page:', { user, staffCount: staff.length, isLoading });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Settings
        </h1>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-12 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue={settingsTabs.find(tab => pathname === tab.href)?.href}
              onChange={(e) => router.push(e.target.value)}
            >
              {settingsTabs.map((tab) => (
                <option key={tab.href} value={tab.href}>{tab.label}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {settingsTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`${
                      pathname === tab.href
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <Button onClick={openAddModal} size="sm">
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Staff Member</span>
          </Button>
        </div>

        {isLoading ? (
          <div>Loading staff...</div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No staff members found.</p>
            <p className="text-sm text-gray-400 mt-2">Debug: Staff array length: {staff.length}</p>
            <Button onClick={openAddModal} className="mt-4">
              Add your first staff member
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {staff.length} staff member(s)
            </div>
            {/* Card layout for mobile */}
            <div className="flex flex-col gap-4 sm:hidden">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                  <div className="font-semibold text-lg">{member.name}</div>
                  <div className="text-gray-600 text-sm">{member.email}</div>
                  <div className="text-gray-500 text-xs mb-2">Role: {member.role}</div>
                  <div className="flex gap-2 mt-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(member)}>Edit</Button>
                    <Link href={`/staff/settings/staff/${member.id}/availability`}>
                      <Button variant="ghost" size="sm">Availability</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setShowDeleteId(member.id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Table layout for desktop */}
            <div className="hidden sm:block bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(member)}>Edit</Button>
                        <Link href={`/staff/settings/staff/${member.id}/availability`} className="ml-2">
                          <Button variant="ghost" size="sm">Availability</Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-red-600 ml-2" onClick={() => setShowDeleteId(member.id)}>Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Modal for adding/editing staff */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
            <form onSubmit={handleAddOrEditStaff} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  required
                >
                  {STAFF_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <MultiSelect
                  options={services.map(s => ({ value: s.id, label: s.name }))}
                  value={selectedServices}
                  onChange={setSelectedServices}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-red-600">Remove Staff Member</h2>
            <p>Are you sure you want to remove this staff member? This action cannot be undone.</p>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setShowDeleteId(null)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={() => showDeleteId && handleDeleteStaff(showDeleteId)} disabled={isSubmitting}>
                {isSubmitting ? 'Removing...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 