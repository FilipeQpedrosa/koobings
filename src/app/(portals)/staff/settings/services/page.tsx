"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { data: session } = useSession();
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
    async function fetchServices() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/staff/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
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
      setServices(await updated.json());
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete service");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleAddOrEditService(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      if (!form.name || !form.duration || !form.price) {
        setFormError("Name, duration, and price are required.");
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
        if (!staffId) {
          throw new Error("Staff ID not found in session");
        }
        const assignRes = await fetch("/api/staff/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staffId, serviceIds: [createdService.id] }),
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
      setServices(await updated.json());
    } catch (err: any) {
      setFormError(err.message || "Failed to save service");
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Services Management</h1>
      <div className="flex gap-2 mb-6">
        {settingsTabs.map(tab => (
          <Link key={tab.href} href={tab.href} legacyBehavior>
            <a className={`px-4 py-2 rounded ${pathname === tab.href ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{tab.label}</a>
          </Link>
        ))}
      </div>
      <Button onClick={openAddModal} className="mb-4">Add Service</Button>
      {loading ? (
        <div>Loading services...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          {services.map(service => (
            <li key={service.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-lg">{service.name}</div>
                <div className="text-gray-500 text-sm">
                  {service.duration} min &bull; €{service.price}
                  {service.category && (
                    <span className="ml-2">Category: {typeof service.category === "string" ? service.category : service.category?.name}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openEditModal(service)}>Edit</Button>
                <Button variant="destructive" onClick={() => openDeleteModal(service)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
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
    </div>
  );
} 