"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

function CategoryModal({
  form,
  setForm,
  formError,
  setShowModal,
  handleAddOrEditCategory,
  editCategory,
}: {
  form: { name: string; description: string; color: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; color: string }>>;
  formError: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddOrEditCategory: (e: React.FormEvent) => void;
  editCategory: Category | null;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{editCategory ? 'Edit Category' : 'Add Category'}</h2>
        <form onSubmit={handleAddOrEditCategory} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
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
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#cccccc' });
  const [formError, setFormError] = useState('');
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/services/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  function openAddModal() {
    setEditCategory(null);
    setForm({ name: '', description: '', color: '#cccccc' });
    setFormError('');
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditCategory(category);
    setForm({
      name: category.name || '',
      description: category.description || '',
      color: category.color || '#cccccc',
    });
    setFormError('');
    setShowModal(true);
  }

  function openDeleteModal(category: Category) {
    setDeleteCategory(category);
    setDeleteError('');
    setDeleteLoading(false);
  }

  async function handleConfirmDelete() {
    if (!deleteCategory) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/services/categories/${deleteCategory.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete category');
      }
      setDeleteCategory(null);
      // Refresh list
      const updated = await fetch('/api/services/categories');
      const data = await updated.json();
      setCategories(data.categories || []);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleAddOrEditCategory(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    try {
      if (!form.name) {
        setFormError('Name is required.');
        return;
      }
      const payload: any = {
        name: form.name,
        description: form.description,
        color: form.color,
      };
      let res;
      if (editCategory) {
        res = await fetch(`/api/services/categories/${editCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/services/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save category');
      }
      setShowModal(false);
      setForm({ name: '', description: '', color: '#cccccc' });
      setEditCategory(null);
      // Refresh list
      const updated = await fetch('/api/services/categories');
      const data = await updated.json();
      setCategories(data.categories || []);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category');
    }
  }

  // Only show to admin staff
  if (session?.user?.staffRole !== 'ADMIN') {
    return <div className="p-8">You do not have permission to manage categories.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Button onClick={openAddModal}>
          Add Category
        </Button>
      </div>
      {loading ? (
        <div>Loading categories...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : categories.length === 0 ? (
        <div className="text-gray-500">No categories found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.description || ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block w-6 h-6 rounded-full border" style={{ backgroundColor: category.color || '#cccccc' }} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 ml-2" onClick={() => openDeleteModal(category)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for adding/editing category */}
      {showModal && (
        <CategoryModal
          form={form}
          setForm={setForm}
          formError={formError}
          setShowModal={setShowModal}
          handleAddOrEditCategory={handleAddOrEditCategory}
          editCategory={editCategory}
        />
      )}
      {/* Modal for confirming delete */}
      {deleteCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to remove this category?</p>
            {deleteError && <div className="text-red-600 text-sm mt-2">{deleteError}</div>}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setDeleteCategory(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Removing...' : 'Remove'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 