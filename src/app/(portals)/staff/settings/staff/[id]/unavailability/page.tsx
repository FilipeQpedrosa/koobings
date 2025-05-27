"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Unavailability {
  id: string;
  start: string;
  end: string;
  reason?: string;
}

export default function StaffUnavailabilityPage() {
  const { id: staffId } = useParams() as { id: string };
  const [unavailability, setUnavailability] = useState<Unavailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Unavailability | null>(null);
  const [form, setForm] = useState({ start: "", end: "", reason: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchUnavailability() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/staff/${staffId}/unavailability`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch");
      setUnavailability(data.data);
    } catch (err: any) {
      setError(err.message || "Error fetching unavailability");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (staffId) fetchUnavailability();
  }, [staffId]);

  function openAddModal() {
    setEditItem(null);
    setForm({ start: "", end: "", reason: "" });
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(item: Unavailability) {
    setEditItem(item);
    setForm({ start: item.start.slice(0, 16), end: item.end.slice(0, 16), reason: item.reason || "" });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (!form.start || !form.end) {
        setFormError("Start and end are required.");
        setSaving(false);
        return;
      }
      const payload = { start: form.start, end: form.end, reason: form.reason };
      let res;
      if (editItem) {
        res = await fetch(`/api/staff/${staffId}/unavailability`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, unavailabilityId: editItem.id }),
        });
      } else {
        res = await fetch(`/api/staff/${staffId}/unavailability`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save");
      setShowModal(false);
      fetchUnavailability();
    } catch (err: any) {
      setFormError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/staff/${staffId}/unavailability`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unavailabilityId: deleteId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete");
      setDeleteId(null);
      fetchUnavailability();
    } catch (err: any) {
      setError(err.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-bold mb-4">Staff Unavailability</h1>
      <Button onClick={openAddModal} className="mb-4">Add Unavailability</Button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {unavailability.length === 0 && <div className="text-gray-500">No unavailability periods defined.</div>}
          {unavailability.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="font-semibold">{new Date(item.start).toLocaleString()} - {new Date(item.end).toLocaleString()}</div>
                {item.reason && <div className="text-gray-600 text-sm">Reason: {item.reason}</div>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for add/edit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editItem ? "Edit Unavailability" : "Add Unavailability"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.start}
                  onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.end}
                  onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                />
              </div>
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editItem ? "Save Changes" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Unavailability</h2>
            <p className="mb-4">Are you sure you want to delete this unavailability period?</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setDeleteId(null)} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 