"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'PROVIDER', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const pathname = usePathname();
  const [canViewAllBookings, setCanViewAllBookings] = useState(false);
  const [requireAdminCancelApproval, setRequireAdminCancelApproval] = useState(false);

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
    fetchStaff();
  }, []);

  async function fetchStaff() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/staff');
      if (!response.ok) throw new Error('Failed to fetch staff');
      const data = await response.json();
      setStaff(data);
    } catch (err) {
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
      setServices(data);
    } catch (err) {
      setServices([]);
    }
  }

  function openAddModal() {
    setEditId(null);
    setForm({ name: '', email: '', role: 'PROVIDER', password: '' });
    setSelectedServices([]);
    setShowModal(true);
    fetchServices();
  }

  function openEditModal(member: StaffMember) {
    setEditId(member.id);
    setForm({ name: member.name, email: member.email, role: member.role, password: '' });
    setSelectedServices(member.services ? member.services.map(s => s.id) : []);
    setCanViewAllBookings(member.permissions?.includes('canViewAllBookings') ?? false);
    setShowModal(true);
    fetchServices();
  }

  async function handleAddOrEditStaff(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      let response;
      const payload = { ...form, services: selectedServices, permissions: (form as any).permissions || [] };
      if (canViewAllBookings) {
        if (!payload.permissions.includes('canViewAllBookings')) {
          payload.permissions.push('canViewAllBookings');
        }
      } else {
        payload.permissions = payload.permissions.filter((p: string) => p !== 'canViewAllBookings');
      }
      if (editId) {
        response = await fetch(`/api/staff/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/staff', {
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
      setForm({ name: '', email: '', role: 'PROVIDER', password: '' });
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
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/staff/${id}`, {
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

  // Only show to admin staff
  if (session?.user?.staffRole !== 'ADMIN') {
    return <div className="p-8">You do not have permission to manage staff.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {settingsTabs.map(tab => (
          <Link key={tab.href} href={tab.href} legacyBehavior>
            <a className={`px-3 py-2 rounded whitespace-nowrap text-sm sm:text-base ${pathname === tab.href ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{tab.label}</a>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={openAddModal}>
          Add Staff Member
        </Button>
      </div>
      {session?.user?.staffRole === 'ADMIN' && (
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="requireAdminCancelApproval"
            checked={requireAdminCancelApproval}
            onChange={e => setRequireAdminCancelApproval(e.target.checked)}
          />
          <label htmlFor="requireAdminCancelApproval" className="text-sm font-medium">
            Require admin approval for staff appointment cancellations
          </label>
        </div>
      )}
      {isLoading ? (
        <div>Loading staff...</div>
      ) : staff.length === 0 ? (
        <div className="text-gray-500">No staff members found.</div>
      ) : (
        <>
          {/* Card layout for mobile */}
          <div className="flex flex-col gap-4 sm:hidden">
            {staff.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                <div className="font-semibold text-lg">{member.name}</div>
                <div className="text-gray-600 text-sm">{member.email}</div>
                <div className="text-gray-500 text-xs mb-2">Role: {member.role}</div>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(member)}>Edit</Button>
                  <Link href={`/staff/settings/staff/${member.id}/availability`} passHref legacyBehavior>
                    <Button variant="ghost" size="sm" className="text-blue-600 ml-2">Availability</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setShowDeleteId(member.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
          {/* Table layout for desktop */}
          <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(member)}>Edit</Button>
                    <Link href={`/staff/settings/staff/${member.id}/availability`} passHref legacyBehavior>
                      <Button variant="ghost" size="sm" className="text-blue-600 ml-2">Availability</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setShowDeleteId(member.id)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {/* Modal for adding/editing staff */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
            <form onSubmit={handleAddOrEditStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
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
              {session?.user?.staffRole === 'ADMIN' && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="canViewAllBookings"
                    checked={canViewAllBookings}
                    onChange={e => setCanViewAllBookings(e.target.checked)}
                  />
                  <label htmlFor="canViewAllBookings" className="text-sm">Allow this staff member to view all bookings</label>
                </div>
              )}
              <div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 