'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import Link from 'next/link';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  services?: { id: string; name: string }[];
}

interface Service {
  id: string;
  name: string;
}

const STAFF_ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PROVIDER', label: 'Provider' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
  { value: 'ASSISTANT', label: 'Assistant' },
];

export default function BusinessStaffPage() {
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

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/staff');
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
      const response = await fetch('/api/business/services');
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={openAddModal}>
          Add Staff Member
        </Button>
      </div>
      {isLoading ? (
        <div>Loading staff...</div>
      ) : staff.length === 0 ? (
        <div className="text-gray-500">No staff members found.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
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
                  <Link href={`/business/staff/${member.id}/availability`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 ml-2">Availability</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setShowDeleteId(member.id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  disabled={!!editId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <MultiSelect
                  options={services.map(s => ({ label: s.name, value: s.id }))}
                  value={selectedServices}
                  onChange={setSelectedServices}
                  placeholder="Select services..."
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
                  {STAFF_ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{editId ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required={!editId}
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditId(null); }} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Staff')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm delete dialog */}
      {showDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Remove Staff Member</h2>
            <p>Are you sure you want to remove this staff member? This action cannot be undone.</p>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setShowDeleteId(null)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={() => handleDeleteStaff(showDeleteId)} disabled={isSubmitting}>
                {isSubmitting ? 'Removing...' : 'Remove'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 