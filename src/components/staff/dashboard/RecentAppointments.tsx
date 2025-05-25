'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AppointmentStatus } from '@prisma/client';

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  dateTime: Date;
  status: AppointmentStatus;
  duration: number;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
  onStatusChange?: () => void;
}

const getStatusColor = (status: AppointmentStatus) => {
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
};

export default function RecentAppointments({ appointments, onStatusChange }: RecentAppointmentsProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | AppointmentStatus>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = statusFilter === 'ALL' ? appointments : appointments.filter(a => a.status === statusFilter);

  async function handleStatusChange(id: string, newStatus: AppointmentStatus) {
    setUpdatingId(id);
    await fetch(`/api/business/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdatingId(null);
    onStatusChange && onStatusChange();
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <div className="mt-2 flex gap-2 items-center">
          <span>Status:</span>
          <select
            className="border rounded p-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.clientName}</TableCell>
                <TableCell>{appointment.serviceName}</TableCell>
                <TableCell>{format(appointment.dateTime, 'PPp')}</TableCell>
                <TableCell>{appointment.duration} min</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <select
                    className="border rounded p-1"
                    value={appointment.status}
                    disabled={updatingId === appointment.id}
                    onChange={e => handleStatusChange(appointment.id, e.target.value as AppointmentStatus)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 