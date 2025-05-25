"use client";
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const fetchStaff = async () => {
  const res = await fetch('/api/staff');
  if (!res.ok) throw new Error('Failed to fetch staff');
  return res.json();
};

const fetchAppointments = async (date: string, staffId?: string) => {
  let url = `/api/business/appointments?date=${date}`;
  if (staffId && staffId !== 'all') url += `&staffId=${staffId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
};

const markStatus = async (id: string, status: string) => {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update appointment');
  return res.json();
};

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-gray-200 text-gray-700',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>{statusOptions.find(o => o.value === status)?.label || status}</span>
  );
}

function Example() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [localAppointments, setLocalAppointments] = useState<any[]>([]);
  const queryClient = useQueryClient();

  // Fetch staff list on mount
  useEffect(() => {
    fetchStaff().then(setStaffList).catch(() => setStaffList([]));
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ['appointments', selectedDate, selectedStaff],
    queryFn: () => fetchAppointments(selectedDate, selectedStaff),
  });

  useEffect(() => {
    setLocalAppointments(Array.isArray(data) ? data : []);
  }, [data]);

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => markStatus(id, status),
    onMutate: async ({ id, status }) => {
      setLocalAppointments((prev) => prev.map((apt) => apt.id === id ? { ...apt, status } : apt));
    },
    onError: (_err, { id }, _ctx) => {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
      queryClient.invalidateQueries({ queryKey: ['appointments', selectedDate, selectedStaff] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', selectedDate, selectedStaff] });
      // Optionally, also invalidate bookings page queries if using react-query there
    },
  });

  if (isLoading) return <div className="p-6">Loading appointments...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading appointments!</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-44"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Staff</label>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffList.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-40">Client</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-32">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-32">Staff</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-40">Service</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-44">Date/Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localAppointments.map((apt) => (
              <tr key={apt.id}>
                <td className="px-4 py-2 whitespace-nowrap max-w-[160px] truncate">
                  {apt.clientName || apt.patientName || '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    <Select
                      value={apt.status}
                      onValueChange={status => mutation.mutate({ id: apt.id, status })}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger className="w-28 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap max-w-[120px] truncate">{apt.provider?.name || apt.staffName || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap max-w-[180px] truncate">{apt.service?.name || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap max-w-[200px] truncate">
                  {apt.date ? format(new Date(apt.date), 'yyyy-MM-dd') : '-'}<br />
                  <span className="text-xs text-gray-500">{apt.time}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
} 