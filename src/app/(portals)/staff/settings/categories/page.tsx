"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

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

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string;
  category: Category | null;
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
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading} ref={undefined}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function StaffSettingsCategoriesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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

  function openEditModal(category: Category) {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  }

  function openAddModal() {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
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

  // Admin-only guard
  if (status === 'authenticated' && session.user.staffRole !== 'ADMIN') {
    return <div className="p-8">You do not have permission to manage categories.</div>;
  }

  return (
    <>
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
            <h2 className="text-2xl font-bold">Categories Management</h2>
            <Button onClick={openAddModal} size="sm">
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add New Category</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found.</p>
              <Button onClick={openAddModal} className="mt-4">
                Add your first category
              </Button>
            </div>
          ) : (
            <>
              {/* Card layout for mobile */}
              <div className="flex flex-col gap-4 sm:hidden">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color || '#ccc' }}></span>
                        <div className="font-semibold text-lg">{category.name}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => openDeleteDialog(category)}>Remove</Button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                    )}
                  </div>
                ))}
              </div>
              {/* Table layout for desktop */}
              <div className="hidden sm:block bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full mr-3" style={{ backgroundColor: category.color || '#ccc' }}></div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.services?.length || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600 ml-2" onClick={() => openDeleteDialog(category)}>Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteCategory}
        loading={deleteLoading}
        error={deleteError}
        category={categoryToDelete}
      />
    </>
  );
} 