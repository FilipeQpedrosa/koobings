"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminBusinessDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/businesses/${id}`);
        if (!res.ok) throw new Error("Business not found");
        const data = await res.json();
        setBusiness(data);
      } catch (err: any) {
        setError(err.message || "Failed to load business");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBusiness();
  }, [id]);

  if (loading) return <div className="p-8">Loading business details...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!business) return <div className="p-8">Business not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <Button variant="outline" onClick={() => router.push(`/admin/businesses/${id}/edit`)}>Edit</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-2"><b>Email:</b> {business.email || <span className="text-gray-400">—</span>}</div>
        <div className="mb-2"><b>Status:</b> {business.status || <span className="text-gray-400">—</span>}</div>
        <div className="mb-2"><b>Owner:</b> {business.ownerName || <span className="text-gray-400">—</span>}</div>
        <div className="mb-2"><b>Created:</b> {business.createdAt ? new Date(business.createdAt).toLocaleString() : <span className="text-gray-400">—</span>}</div>
        <div className="mb-2"><b>ID:</b> {business.id}</div>
        <div className="mt-4">
          <Button variant="destructive">Deactivate</Button>
        </div>
      </div>
      {/* Staff List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Staff</h2>
        {business.staff && business.staff.length > 0 ? (
          <ul className="space-y-1">
            {business.staff.map((s: any) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-gray-500">{s.email}</span>
                <span className="text-xs text-gray-400">{s.role}</span>
              </li>
            ))}
          </ul>
        ) : <div className="text-gray-500 text-sm">No staff found.</div>}
      </div>
      {/* Services List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Services</h2>
        {business.services && business.services.length > 0 ? (
          <ul className="space-y-1">
            {business.services.map((s: any) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-gray-500">{s.duration} min</span>
                <span className="text-xs text-gray-400">${s.price}</span>
              </li>
            ))}
          </ul>
        ) : <div className="text-gray-500 text-sm">No services found.</div>}
      </div>
      {/* Bookings Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Bookings</h2>
        {business.bookings && business.bookings.length > 0 ? (
          <ul className="space-y-1">
            {business.bookings.slice(0, 5).map((b: any) => (
              <li key={b.id} className="flex items-center gap-2">
                <span className="font-medium">{b.clientName}</span>
                <span className="text-xs text-gray-500">{b.serviceName}</span>
                <span className="text-xs text-gray-400">{new Date(b.scheduledFor).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : <div className="text-gray-500 text-sm">No recent bookings.</div>}
      </div>
    </div>
  );
} 