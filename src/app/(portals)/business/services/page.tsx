'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Placeholder service type
interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category?: { name: string } | string;
}

function ServiceModal({ form, setForm, formError, setShowModal, handleAddOrEditService, categories, editService }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{editService ? 'Edit Service' : 'Add Service'}</h2>
        <form onSubmit={handleAddOrEditService} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              required
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (€)</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              required
              min={0}
              step={0.01}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.categoryId}
              onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="">No category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editService ? 'Save Changes' : 'Add Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BusinessServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ name: '', duration: '', price: '', categoryId: '', description: '' });
  const [formError, setFormError] = useState('');
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/business/services');
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching services');
      } finally {
        setLoading(false);
      }
    }
    async function fetchCategories() {
      try {
        const res = await fetch('/api/business/categories');
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch {}
    }
    fetchServices();
    fetchCategories();
  }, []);

  function openAddModal() {
    setEditService(null);
    setForm({ name: '', duration: '', price: '', categoryId: '', description: '' });
    setFormError('');
    setShowModal(true);
  }

  function openEditModal(service: Service) {
    setEditService(service);
    setForm({
      name: service.name || '',
      duration: service.duration?.toString() || '',
      price: service.price?.toString() || '',
      categoryId: typeof service.category === 'string' ? '' : (service.category as any)?.id || '',
      description: (service as any).description || '',
    });
    setFormError('');
    setShowModal(true);
  }

  function openDeleteModal(service: Service) {
    setDeleteService(service);
    setDeleteError('');
    setDeleteLoading(false);
  }

  async function handleConfirmDelete() {
    if (!deleteService) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/business/services/${deleteService.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete service');
      }
      setDeleteService(null);
      // Refresh list
      const updated = await fetch('/api/business/services');
      setServices(await updated.json());
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete service');
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleAddOrEditService(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    try {
      if (!form.name || !form.duration || !form.price) {
        setFormError('Name, duration, and price are required.');
        return;
      }
      const payload: any = {
        name: form.name,
        duration: Number(form.duration),
        price: Number(form.price),
      };
      if (form.categoryId) payload.categoryId = form.categoryId;
      if (form.description) payload.description = form.description;
      let res;
      if (editService) {
        res = await fetch(`/api/business/services/${editService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/business/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save service');
      }
      setShowModal(false);
      setForm({ name: '', duration: '', price: '', categoryId: '', description: '' });
      setEditService(null);
      // Refresh list
      const updated = await fetch('/api/business/services');
      setServices(await updated.json());
    } catch (err: any) {
      setFormError(err.message || 'Failed to save service');
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={openAddModal}>Add Service</Button>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading services...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (€)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map(service => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{typeof service.category === 'string' ? service.category : service.category?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(service)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => openDeleteModal(service)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <ServiceModal
          form={form}
          setForm={setForm}
          formError={formError}
          setShowModal={setShowModal}
          handleAddOrEditService={handleAddOrEditService}
          categories={categories}
          editService={editService}
        />
      )}
      {deleteService && (
        <DeleteModal
          service={deleteService}
          onCancel={() => setDeleteService(null)}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </div>
  );
}

function DeleteModal({ service, onCancel, onConfirm, loading, error }) {
  if (!service) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete Service</h2>
        <p>Are you sure you want to delete <span className="font-semibold">{service.name}</span>? This action cannot be undone.</p>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
} 