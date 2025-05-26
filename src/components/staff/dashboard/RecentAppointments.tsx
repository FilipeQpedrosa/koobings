'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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

export default function RecentAppointments({ appointments = [] }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = statusFilter === 'ALL' ? appointments : appointments.filter(a => a.status === statusFilter);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    // TODO: Replace with real API call
    setTimeout(() => setUpdatingId(null), 500); // Simulate async
  }

  return (
    <div className="col-span-4">
      <div className="font-bold text-lg mb-2">Recent Appointments</div>
      <div className="mt-2 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <span>Status:</span>
        <select
          className="border rounded p-2 text-sm sm:text-base"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      {/* Mobile: Card/List view */}
      <div className="sm:hidden space-y-4 mt-4">
        {filtered.length === 0 && <div className="text-gray-500 text-center">No appointments found.</div>}
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-base">{apt.clientName}</div>
              <Badge variant="outline" className={getStatusColor(apt.status)}>
                {apt.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">{apt.serviceName}</div>
            <div className="text-xs text-gray-500">{format(new Date(apt.dateTime), 'PPp')}</div>
            <div className="text-xs text-gray-500">Duration: {apt.duration} min</div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-medium">Change Status:</label>
              <select
                className="border rounded p-2 text-sm"
                value={apt.status}
                disabled={updatingId === apt.id}
                onChange={e => handleStatusChange(apt.id, e.target.value)}
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
      <div className="hidden sm:block mt-4">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt) => (
              <tr key={apt.id}>
                <td className="font-medium">{apt.clientName}</td>
                <td>{apt.serviceName}</td>
                <td>{format(new Date(apt.dateTime), 'PPp')}</td>
                <td>{apt.duration} min</td>
                <td>
                  <Badge variant="outline" className={getStatusColor(apt.status)}>
                    {apt.status}
                  </Badge>
                </td>
                <td>
                  <select
                    className="border rounded p-1"
                    value={apt.status}
                    disabled={updatingId === apt.id}
                    onChange={e => handleStatusChange(apt.id, e.target.value)}
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