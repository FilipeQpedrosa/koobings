"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';

// Placeholder service type
interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category?: { name: string } | string;
}

interface ServiceModalProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  formError: string;
  setShowModal: (show: boolean) => void;
  handleAddOrEditService: (e: React.FormEvent) => void;
  categories: { id: string; name: string }[];
  editService: Service | null;
}

function ServiceModal({ form, setForm, formError, setShowModal, handleAddOrEditService, categories, editService }: ServiceModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{editService ? "Edit Service" : "Add Service"}</h2>
        <form onSubmit={handleAddOrEditService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.name}
              onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.duration}
              onChange={e => setForm((f: any) => ({ ...f, duration: e.target.value }))}
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
              onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))}
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
              onChange={e => setForm((f: any) => ({ ...f, categoryId: e.target.value }))}
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
              onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
            />
          </div>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editService ? "Save Changes" : "Add Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const settingsTabs = [
  { label: 'General', href: '/staff/settings' },
  { label: 'Services', href: '/staff/settings/services' },
  { label: 'Staff', href: '/staff/settings/staff' },
  { label: 'Categories', href: '/staff/settings/categories' },
];

export default function StaffSettingsServicesPage() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ name: "", duration: "", price: "", categoryId: "", description: "" });
  const [formError, setFormError] = useState("");
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    async function fetchServices() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/staff/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data.data);
      } catch (err: any) {
        setError(err.message || "Error fetching services");
      } finally {
        setLoading(false);
      }
    }
    async function fetchCategories() {
      try {
        const res = await fetch("/api/staff/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch {}
    }
    fetchServices();
    fetchCategories();
  }, []);

  function openAddModal() {
    setEditService(null);
    setForm({ name: "", duration: "", price: "", categoryId: "", description: "" });
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(service: Service) {
    setEditService(service);
    setForm({
      name: service.name || "",
      duration: service.duration?.toString() || "",
      price: service.price?.toString() || "",
      categoryId: typeof service.category === "string" ? "" : (service.category as any)?.id || "",
      description: (service as any).description || "",
    });
    setFormError("");
    setShowModal(true);
  }

  function openDeleteModal(service: Service) {
    setDeleteService(service);
    setDeleteError("");
    setDeleteLoading(false);
  }

  async function handleConfirmDelete() {
    if (!deleteService) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/staff/services/${deleteService.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete service");
      }
      setDeleteService(null);
      // Refresh list
      const updated = await fetch("/api/staff/services");
      setServices((await updated.json()).data);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete service");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleAddOrEditService(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.duration || !form.price) {
      setFormError("Name, duration, and price are required.");
      return;
    }
    if (isNaN(Number(form.duration)) || Number(form.duration) <= 0) {
      setFormError("Duration must be a positive number.");
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      setFormError("Price must be a non-negative number.");
      return;
    }
    try {
      const payload: any = {
        name: form.name,
        duration: Number(form.duration),
        price: Number(form.price),
      };
      if (form.categoryId) payload.categoryId = form.categoryId;
      if (form.description) payload.description = form.description;
      let res;
      if (editService) {
        res = await fetch(`/api/staff/services/${editService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // 1. Create the service via business endpoint
        const createRes = await fetch("/api/business/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!createRes.ok) {
          const err = await createRes.json().catch(() => ({}));
          throw new Error(err.error || "Failed to create service");
        }
        const createdService = await createRes.json();
        // 2. Assign the new service to this staff member
        const staffId = session?.user?.id;
        const newServiceId = createdService.data?.id;
        if (!staffId || !newServiceId) {
          throw new Error("Staff ID or new service ID not found");
        }
        const assignRes = await fetch("/api/staff/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staffId, serviceIds: [newServiceId] }),
        });
        if (!assignRes.ok) {
          const err = await assignRes.json().catch(() => ({}));
          throw new Error(err.error || "Failed to assign service to staff");
        }
        res = assignRes;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save service");
      }
      setShowModal(false);
      // Refresh list
      const updated = await fetch("/api/staff/services");
      setServices((await updated.json()).data);
    } catch (err: any) {
      // Try to extract a readable error message from the API response
      if (err && err instanceof Response) {
        try {
          const data = await err.json();
          setFormError(data?.error?.message || data?.error || "Failed to save service");
        } catch {
          setFormError("Failed to save service");
        }
      } else if (err && err.message) {
        setFormError(err.message);
      } else {
        setFormError("Failed to save service");
      }
    }
  }

  // Only show to admin staff
  if (status === 'authenticated' && session.user.staffRole !== 'ADMIN') {
    return <div className="p-8">You do not have permission to manage services.</div>;
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
            <h2 className="text-2xl font-bold">Services Management</h2>
            <Button onClick={openAddModal} size="sm">
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add New Service</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading services...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found.</p>
              <Button onClick={openAddModal} className="mt-4">
                Add your first service
              </Button>
            </div>
          ) : (
            <>
              {/* Card layout for mobile */}
              <div className="flex flex-col gap-4 sm:hidden">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">{service.name}</div>
                        <div className="text-sm text-gray-600">
                          {service.duration} min - €{service.price}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Category: {typeof service.category === 'object' ? service.category?.name : 'N/A'}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(service)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => openDeleteModal(service)}>Remove</Button>
                      </div>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration} min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{service.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeof service.category === 'object' ? service.category?.name : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(service)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600 ml-2" onClick={() => openDeleteModal(service)}>Remove</Button>
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

      {/* Delete confirmation modal */}
      {deleteService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Service</h2>
            <p>Are you sure you want to delete <span className="font-semibold">{deleteService.name}</span>?</p>
            {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setDeleteService(null)} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
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
    </>
  );
} 