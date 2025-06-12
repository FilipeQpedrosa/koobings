'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  dateTime: Date;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  duration: number;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

function getStatusColor(status) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function RecentAppointments({ appointments = [] }: RecentAppointmentsProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localAppointments, setLocalAppointments] = useState(appointments);

  // Keep localAppointments in sync with prop
  React.useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const filtered = statusFilter === 'ALL' ? localAppointments : localAppointments.filter(a => a.status === statusFilter);

  async function handleStatusChange(id: string, newStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setLocalAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-5xl mx-auto">
      <div className="text-3xl font-extrabold mb-6">Recent Appointments</div>
      <div className="mb-6 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <span className="text-lg font-medium">Status:</span>
        <select
          className="border rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      {/* Mobile: Card/List view */}
      <div className="sm:hidden space-y-4">
        {filtered.length === 0 && <div className="text-gray-500 text-center">No appointments found.<br />Reference: #{new Date().getTime()}</div>}
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">{apt.clientName}</div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${getStatusColor(apt.status)} shadow-sm`}>
                {apt.status}
              </span>
            </div>
            <div className="text-base text-gray-700 font-medium">{apt.serviceName}</div>
            <div className="text-sm text-gray-500">{format(new Date(apt.dateTime), 'PP, p')}</div>
            <div className="text-sm text-gray-500">Duration: {apt.duration} min</div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-medium">Change Status:</label>
              <select
                className="border rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={apt.status}
                disabled={updatingId === apt.id}
                onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop: Table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full w-full">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-lg font-bold text-gray-500">Client</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-gray-500">Service</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-gray-500">Date & Time</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-gray-500">Duration</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-gray-500">Status</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400 text-lg">No appointments found.<br />Reference: #{new Date().getTime()}</td>
              </tr>
            )}
            {filtered.map((apt) => (
              <tr key={apt.id} className="border-b last:border-b-0">
                <td className="px-6 py-4 font-bold text-xl">{apt.clientName}</td>
                <td className="px-6 py-4 text-lg">{apt.serviceName}</td>
                <td className="px-6 py-4 text-lg">{format(new Date(apt.dateTime), 'PP, p')}</td>
                <td className="px-6 py-4 text-lg">{apt.duration} min</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${getStatusColor(apt.status)} shadow-sm`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="border rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={apt.status}
                    disabled={updatingId === apt.id}
                    onChange={e => handleStatusChange(apt.id, e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 