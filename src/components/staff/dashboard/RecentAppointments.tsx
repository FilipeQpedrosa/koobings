'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface Appointment {
  id: string;
  client: {
    name: string;
    image?: string;
  };
  services: { name: string }[];
  scheduledFor: string;
  duration: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

function getStatusColor(status: Appointment['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-200 text-green-800';
    case 'CANCELLED':
      return 'bg-red-200 text-red-800';
    case 'PENDING':
      return 'bg-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      setIsLoading(true);
      let url = '/api/business/appointments?limit=10';
      if (dateRange?.from) {
        url = `/api/business/appointments?startDate=${format(dateRange.from, 'yyyy-MM-dd')}`;
        if (dateRange.to) {
          url += `&endDate=${format(dateRange.to, 'yyyy-MM-dd')}`;
        }
      }
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(data?.data?.appointments || []);
      } catch (err) {
        // Handle error silently for now, or use a toast notification
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }, [dateRange]);

  const filteredAppointments = statusFilter === 'ALL'
    ? appointments
    : Array.isArray(appointments) ? appointments.filter(a => a.status === statusFilter) : [];

  async function handleStatusChange(id: string, newStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 md:p-8 w-full">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Recent Appointments</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="font-medium">Status:</label>
          <select
            id="status-filter"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y", { locale: enUS })} -{" "}
                      {format(dateRange.to, "LLL dd, y", { locale: enUS })}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y", { locale: enUS })
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={enUS}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No appointments match the current filters.</div>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{apt.client.name}</h3>
                    <Badge className={cn(getStatusColor(apt.status), "text-xs")}>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="text-gray-700">{apt.services?.[0]?.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{format(new Date(apt.scheduledFor), 'PP p', { locale: enUS })}</div>
                  <div className="text-sm text-gray-500">{apt.duration} min</div>
                  <div className="mt-4">
                     <select
                        className="w-full border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
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
              ))
            )}
          </div>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No appointments match the current filters.</td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{apt.client.name}</td>
                      <td className="px-4 py-3">{apt.services?.[0]?.name}</td>
                      <td className="px-4 py-3">{format(new Date(apt.scheduledFor), 'PP p', { locale: enUS })}</td>
                      <td className="px-4 py-3">{apt.duration} min</td>
                      <td className="px-4 py-3">
                        <Badge className={cn(getStatusColor(apt.status), "text-xs")}>
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 