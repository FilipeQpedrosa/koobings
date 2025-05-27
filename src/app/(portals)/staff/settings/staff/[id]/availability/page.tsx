"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Unavailability {
  id: string;
  start: string;
  end: string;
  reason?: string;
}

export default function StaffAvailabilityPage() {
  const { id: staffId } = useParams() as { id: string };
  const [activeTab, setActiveTab] = useState<'weekly' | 'unavailability'>('unavailability');
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
  const [halfDay, setHalfDay] = useState<'all' | 'morning' | 'afternoon'>('all');
  const router = useRouter();

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
    setForm({ start: '', end: '', reason: '' });
    setHalfDay('all');
    setFormError('');
    setShowModal(true);
  }

  function openEditModal(item: Unavailability) {
    setEditItem(item);
    setForm({ start: item.start.slice(0, 16), end: item.end.slice(0, 16), reason: item.reason || '' });
    setHalfDay('all');
    setFormError('');
    setShowModal(true);
  }

  function handleDateChange(date: string) {
    if (!date) return;
    if (halfDay === 'morning') {
      setForm(f => ({ ...f, start: `${date}T08:00`, end: `${date}T13:00` }));
    } else if (halfDay === 'afternoon') {
      setForm(f => ({ ...f, start: `${date}T14:00`, end: `${date}T23:59` }));
    } else {
      setForm(f => ({ ...f, start: `${date}T08:00`, end: `${date}T23:59` }));
    }
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
      <button onClick={() => router.push('/staff/settings/staff')} className="mb-4 text-blue-600 hover:underline">← Back to Staff</button>
      <h1 className="text-2xl font-bold mb-4">Staff Availability</h1>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'weekly' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly Availability
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'unavailability' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('unavailability')}
        >
          Unavailability
        </button>
      </div>
      {/* Tab content */}
      {activeTab === 'weekly' && (
        <div className="mb-8">
          <div className="font-semibold mb-2">Weekly/Recurring Availability</div>
          <div className="text-gray-500 text-sm">(Coming soon or integrate your existing availability UI here)</div>
        </div>
      )}
      {activeTab === 'unavailability' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Unavailability (Holidays, Absences)</div>
            <Button onClick={openAddModal}>Add Unavailability</Button>
          </div>
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
        </>
      )}
      {/* Modal for add/edit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editItem ? "Edit Unavailability" : "Add Unavailability"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={form.start ? form.start.slice(0, 10) : ''}
                  onChange={e => handleDateChange(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 mb-2">
                {[
                  { label: 'All Day', value: 'all' },
                  { label: 'Morning Only', value: 'morning' },
                  { label: 'Afternoon Only', value: 'afternoon' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${halfDay === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                    onClick={() => { setHalfDay(opt.value as any); handleDateChange(form.start ? form.start.slice(0, 10) : ''); }}
                    aria-pressed={halfDay === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
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