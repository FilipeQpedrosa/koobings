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
        const response = await res.json();
        setBusiness(response.data);
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 break-words">{business.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Business ID: {business.id}</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/admin/businesses/${id}/edit`)}>Edit</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="text-gray-900">{business.email || <span className="text-gray-400">—</span>}</div>
            </div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="text-gray-900">{business.status || <span className="text-gray-400">—</span>}</div>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-500">Owner</label>
              <div className="text-gray-900">{business.ownerName || <span className="text-gray-400">—</span>}</div>
            </div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-500">Created</label>
              <div className="text-gray-900">{business.createdAt ? new Date(business.createdAt).toLocaleString() : <span className="text-gray-400">—</span>}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t">
          <Button variant="destructive">Deactivate</Button>
        </div>
      </div>

      {/* Staff List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Staff</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {business.staff && business.staff.length > 0 ? (
            <ul className="space-y-3">
              {business.staff.map((s: any) => (
                <li key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium text-gray-900">{s.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{s.email}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">{s.role}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-500 text-center py-4">No staff found.</div>}
        </div>
      </div>

      {/* Services List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Services</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {business.services && business.services.length > 0 ? (
            <ul className="space-y-3">
              {business.services.map((s: any) => (
                <li key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">{s.name}</span>
                  <div className="flex gap-2">
                    <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">{s.duration} min</span>
                    <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">${s.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-500 text-center py-4">No services found.</div>}
        </div>
      </div>

      {/* Bookings Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Bookings</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {business.appointments && business.appointments.length > 0 ? (
            <ul className="space-y-3">
              {business.appointments.slice(0, 5).map((appointment: any) => (
                <li key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium text-gray-900">{appointment.client?.name || 'Unknown Client'}</span>
                    <span className="text-sm text-gray-500 ml-2">{appointment.service?.name || 'Unknown Service'}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(appointment.scheduledFor).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-500 text-center py-4">No recent bookings.</div>}
        </div>
      </div>
    </div>
  );
} 