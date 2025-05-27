"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const settingsTabs = [
  { label: 'General', href: '/staff/settings' },
  { label: 'Services', href: '/staff/settings/services' },
  { label: 'Staff', href: '/staff/settings/staff' },
  { label: 'Categories', href: '/staff/settings/categories' },
];

interface Category {
  id: string;
  name: string;
  color?: string;
  description?: string;
  services: any[];
}

interface CategoryModalProps {
  form: { name: string; color: string; description: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; color: string; description: string }>>;
  formError: string;
  setShowModal: (show: boolean) => void;
  handleAddCategory: (e: React.FormEvent) => void;
}

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string;
  category: Category | null;
}

function CategoryModal({ form, setForm, formError, setShowModal, handleAddCategory }: CategoryModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              className="mt-1 block w-12 h-8 border border-gray-300 rounded-md p-1"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            />
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
              Add Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffSettingsCategoriesPage() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', color: '', description: '' });
  const [formError, setFormError] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/staff/categories');
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch categories');
        setCategories(data.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    try {
      if (!form.name) {
        setFormError('Name is required.');
        return;
      }
      const payload: any = { name: form.name };
      if (form.color) payload.color = form.color;
      if (form.description) payload.description = form.description;
      let res, data;
      if (editCategoryId) {
        // Edit mode
        res = await fetch(`/api/staff/categories/${editCategoryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update category');
      } else {
        // Add mode
        res = await fetch('/api/staff/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create category');
        }
      }
      setShowModal(false);
      setForm({ name: '', color: '', description: '' });
      setEditCategoryId(null);
      // Refresh list
      const updated = await fetch('/api/staff/categories');
      const updatedData = await updated.json();
      setCategories(updatedData.data);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category');
    }
  }

  function openEditModal(category: Category) {
    setForm({
      name: category.name || '',
      color: category.color || '',
      description: category.description || '',
    });
    setEditCategoryId(category.id);
    setFormError('');
    setShowModal(true);
  }

  function openAddModal() {
    setForm({ name: '', color: '', description: '' });
    setEditCategoryId(null);
    setFormError('');
    setShowModal(true);
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/staff/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
      // Refresh list
      const updated = await fetch('/api/staff/categories');
      const updatedData = await updated.json();
      setCategories(updatedData.data);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  }

  function openDeleteDialog(category: Category) {
    setCategoryToDelete(category);
    setDeleteError('');
    setShowDeleteDialog(true);
  }

  function DeleteDialog({ open, onClose, onConfirm, loading, error, category }: DeleteDialogProps) {
    if (!open || !category) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-red-600">Delete Category</h2>
          <p className="mb-4">Are you sure you want to delete the category <span className="font-semibold">{category.name}</span>? This action cannot be undone.</p>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading} ref={deleteButtonRef}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {settingsTabs.map(tab => (
          <Link key={tab.href} href={tab.href} legacyBehavior>
            <a className={`px-3 py-2 rounded whitespace-nowrap text-sm sm:text-base ${pathname === tab.href ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{tab.label}</a>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={openAddModal}>Add Category</Button>
      </div>
      {showModal && (
        <CategoryModal
          form={form}
          setForm={setForm}
          formError={formError}
          setShowModal={setShowModal}
          handleAddCategory={handleAddCategory}
        />
      )}
      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteCategory}
        loading={deleteLoading}
        error={deleteError}
        category={categoryToDelete}
      />
      {loading ? (
        <div className="text-gray-400">Loading categories...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          {/* Card layout for mobile */}
          <div className="flex flex-col gap-4 sm:hidden">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                <div className="font-semibold text-lg">{category.name}</div>
                <div className="flex items-center gap-2 text-sm">
                  {category.color && (
                    <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  )}
                  <span>{category.color || '-'}</span>
                </div>
                <div className="text-gray-600 text-sm">{category.description || '-'}</div>
                <div className="text-gray-500 text-xs mb-2"># Services: {category.services?.length ?? 0}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => openEditModal(category)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(category)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Table layout for desktop */}
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow hidden sm:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Services</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.color ? (
                      <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                    ) : null}
                    {category.color || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.services?.length ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(category)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(category)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
} 