"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminBusinessEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", status: "ACTIVE", ownerName: "", allowStaffToViewAllBookings: true });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/businesses/${id}`);
        if (!res.ok) throw new Error("Business not found");
        const data = await res.json();
        setBusiness(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          status: data.status || "ACTIVE",
          ownerName: data.ownerName || "",
          allowStaffToViewAllBookings: data.allowStaffToViewAllBookings !== undefined ? data.allowStaffToViewAllBookings : true,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load business");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBusiness();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/businesses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update business");
      router.push(`/admin/businesses/${id}`);
    } catch (err: any) {
      setError(err.message || "Failed to update business");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const res = await fetch(`/api/admin/businesses/${id}/owner-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      setPasswordSuccess("Password updated successfully");
      setNewPassword("");
      setShowPasswordModal(false);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) return <div className="p-8">Loading business...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!business) return <div className="p-8">Business not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Business</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input className="border rounded p-2 w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input className="border rounded p-2 w-full" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select className="border rounded p-2 w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Owner Name</label>
          <input className="border rounded p-2 w-full" value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} />
        </div>
        <div>
          <label className="block font-medium mb-1">Restrict staff to only view their own bookings</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!form.allowStaffToViewAllBookings}
              onChange={e => setForm(f => ({ ...f, allowStaffToViewAllBookings: !e.target.checked }))}
              className="h-4 w-4"
              id="restrict-bookings"
            />
            <label htmlFor="restrict-bookings" className="text-sm">
              When enabled, staff members will only be able to see bookings that are assigned to them. They will not be able to view bookings for other staff members.
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => router.push(`/admin/businesses/${id}`)} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(true)} disabled={saving}>Change Owner Password</Button>
        </div>
      </form>
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogTitle>Change Owner Password</DialogTitle>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              className="border rounded p-2 w-full"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} disabled={passwordSaving}>Cancel</Button>
              <Button type="submit" disabled={passwordSaving || !newPassword}>{passwordSaving ? "Saving..." : "Save Password"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 