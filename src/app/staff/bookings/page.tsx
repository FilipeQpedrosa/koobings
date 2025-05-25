"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { UserPlus, Calendar } from "lucide-react";

interface Booking {
  id: string;
  client: { id: string; name: string; email: string };
  staff: { id: string; name: string };
  services: { id: string; name: string }[];
  scheduledFor: string;
  duration: number;
  status: string;
  notes?: string;
}

function StatusBadge({ status }: { status: string }) {
  // Map backend status to display label and color
  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Booked', color: 'bg-yellow-200 text-yellow-800' },
    COMPLETED: { label: 'Completed', color: 'bg-green-200 text-green-800' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-200 text-red-800' },
  };
  const s = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${s.color}`}>{s.label}</span>
  );
}

function AddBookingStepperModal({ open, onClose, onAddBooking, editBooking, services, clients, staffList }: any) {
  const [step, setStep] = useState(1);
  // Step 1: Client
  const [clientSearch, setClientSearch] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [client, setClient] = useState<{ id: string; name: string; email: string } | null>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", notes: "" });
  const [localClients, setLocalClients] = useState<typeof clients>(clients);
  // Step 2: Services
  const [selectedServices, setServicesState] = useState<string[]>([]);
  // Step 3: Staff & Scheduling
  const [staff, setStaff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');

  useEffect(() => {
    if (editBooking && open) {
      setStep(3);
      setClient(editBooking.client);
      setServicesState(editBooking.services.map((s: any) => s.id));
      setStaff(editBooking.staff.id);
      setDate(editBooking.scheduledFor.slice(0, 10));
      setTime(editBooking.scheduledFor.slice(11, 16));
      setDuration(editBooking.duration);
      setStatus(editBooking.status);
      setNotes(editBooking.notes || "");
    } else if (open && !editBooking) {
      setStep(1);
      setClient(null);
      setServicesState([]);
      setStaff("");
      setDate("");
      setTime("");
      setDuration(0);
      setStatus("PENDING");
      setNotes("");
    }
  }, [editBooking, open]);

  useEffect(() => {
    // Auto-calculate duration from selected services
    const total = selectedServices.reduce((sum, id) => {
      const svc = services.find((s: any) => s.id === id);
      return sum + (svc ? svc.duration : 0);
    }, 0);
    setDuration(total);
  }, [selectedServices, services]);

  useEffect(() => { setLocalClients(clients); }, [clients]);

  // Filter clients by search
  const filteredClients = localClients.filter(
    (c: any) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  function handleSelectClient(c: any) {
    setClient(c);
    setShowAddClient(false);
    setClientSearch("");
  }

  async function handleAddClient() {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        preferredContactMethod: '',
        medicalInfo: {},
        notificationPreferences: {},
        notes: newClient.notes,
      };
      const res = await fetch('/api/business/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao criar cliente');
      const created = await res.json();
      setLocalClients((prev: any) => [...prev, created]);
      setClient({ id: created.id, name: created.name, email: created.email });
      setShowAddClient(false);
      setNewClient({ name: '', email: '', phone: '', notes: '' });
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao criar cliente');
    } finally {
      setSaving(false);
    }
  }

  // Check staff availability when staff, date, time, and duration are set
  useEffect(() => {
    async function checkAvailability() {
      setAvailabilityError('');
      if (!staff || !date || !time || !duration) return;
      const startTime = new Date(date + 'T' + time).toISOString();
      try {
        const res = await fetch('/api/business/appointments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staffId: staff, date, startTime, duration }),
        });
        const data = await res.json();
        if (!data.available) {
          setAvailabilityError('Staff is not available at this time.');
        }
      } catch (err) {
        setAvailabilityError('Error checking availability.');
      }
    }
    checkAvailability();
  }, [staff, date, time, duration]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client || !staff || !date || !time || selectedServices.length === 0 || availabilityError) return;
    setSaving(true);
    setSaveError('');
    try {
      if (editBooking) {
        // PATCH: Only update allowed fields
        const payload: any = {
          status,
          notes,
          scheduledFor: new Date(date + 'T' + time).toISOString(),
        };
        const res = await fetch(`/api/business/appointments/${editBooking.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erro ao atualizar marcação');
        onAddBooking(); // refetch bookings
        onClose();
      } else {
        // Only support single service for now (API limitation)
        const serviceId = selectedServices[0];
        const payload = {
          clientId: client.id,
          serviceId,
          startTime: new Date(date + 'T' + time).toISOString(),
          notes,
          staffId: staff,
        };
        const res = await fetch('/api/business/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erro ao guardar marcação');
        onAddBooking(); // refetch bookings
        onClose();
      }
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao guardar marcação');
    } finally {
      setSaving(false);
    }
  }

  // For time picker dropdown
  function getTimeSlots() {
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        slots.push(`${hour}:${min}`);
      }
    }
    // Filter out past times if selected date is today
    if (date === format(new Date(), 'yyyy-MM-dd')) {
      const now = new Date();
      return slots.filter((t) => {
        const [h, m] = t.split(':').map(Number);
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
      });
    }
    return slots;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{editBooking ? 'Edit Booking' : 'Add Booking'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stepper UI */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 text-center ${step === s ? 'font-bold text-primary' : 'text-gray-400'}`}>{['Client', 'Service', 'Schedule'][s-1]}</div>
            ))}
          </div>
          {/* Step 1: Client */}
          {step === 1 && (
            <div>
              <input
                type="text"
                placeholder="Search client by name or email"
                className="w-full border rounded p-2 mb-2"
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
              />
              <div className="max-h-32 overflow-y-auto mb-2">
                {filteredClients.map((c: any) => (
                  <div key={c.id} className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${client?.id === c.id ? 'bg-blue-100' : ''}`} onClick={() => handleSelectClient(c)}>
                    {c.name} <span className="text-xs text-gray-400">({c.email})</span>
                  </div>
                ))}
                <div className="p-2 cursor-pointer text-blue-600 hover:underline" onClick={() => setShowAddClient(true)}>
                  <UserPlus className="inline w-4 h-4 mr-1" /> Add new client
                </div>
              </div>
              {showAddClient && (
                <div className="border rounded p-2 mt-2">
                  <input type="text" placeholder="Name" className="w-full border rounded p-2 mb-2" value={newClient.name} onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))} />
                  <input type="email" placeholder="Email" className="w-full border rounded p-2 mb-2" value={newClient.email} onChange={e => setNewClient(n => ({ ...n, email: e.target.value }))} />
                  <input type="text" placeholder="Phone" className="w-full border rounded p-2 mb-2" value={newClient.phone} onChange={e => setNewClient(n => ({ ...n, phone: e.target.value }))} />
                  <textarea placeholder="Notes" className="w-full border rounded p-2 mb-2" value={newClient.notes} onChange={e => setNewClient(n => ({ ...n, notes: e.target.value }))} />
                  <Button type="button" onClick={handleAddClient} disabled={saving}>Save Client</Button>
                  {saveError && <div className="text-red-600 text-sm mt-2">{saveError}</div>}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Button type="button" onClick={() => setStep(2)} disabled={!client}>Next</Button>
              </div>
            </div>
          )}
          {/* Step 2: Service */}
          {step === 2 && (
            <div>
              <div className="mb-2">Select service:</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {services.map((svc: any) => (
                  <Button key={svc.id} type="button" variant={selectedServices.includes(svc.id) ? 'default' : 'outline'} onClick={() => setServicesState([svc.id])}>{svc.name}</Button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => setStep(3)} disabled={selectedServices.length === 0}>Next</Button>
              </div>
            </div>
          )}
          {/* Step 3: Schedule */}
          {step === 3 && (
            <div>
              <div className="mb-2">Select staff, date, and time:</div>
              <select className="w-full border rounded p-2 mb-2" value={staff} onChange={e => setStaff(e.target.value)}>
                <option value="">Select staff</option>
                {staffList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input type="date" className="w-full border rounded p-2 mb-2" value={date} onChange={e => setDate(e.target.value)} />
              <select className="w-full border rounded p-2 mb-2" value={time} onChange={e => setTime(e.target.value)}>
                <option value="">Select time</option>
                {getTimeSlots().map((t: string) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {/* Status dropdown for edit mode */}
              {editBooking && (
                <select className="w-full border rounded p-2 mb-2" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="PENDING">Booked</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              )}
              <textarea placeholder="Notes" className="w-full border rounded p-2 mb-2" value={notes} onChange={e => setNotes(e.target.value)} />
              {availabilityError && <div className="text-red-600 text-sm mt-2">{availabilityError}</div>}
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" disabled={saving || !client || !staff || !date || !time || selectedServices.length === 0 || !!availabilityError}>{editBooking ? 'Save Changes' : 'Add Booking'}</Button>
              </div>
              {saveError && <div className="text-red-600 text-sm mt-2">{saveError}</div>}
            </div>
          )}
        </form>
        <div className="flex justify-end mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default function StaffBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        let url = `/api/business/appointments`;
        if (selectedDate && selectedDate !== 'all') {
          url += `?date=${selectedDate}`;
          if (selectedStaff && selectedStaff !== 'all') {
            url += `&staffId=${selectedStaff}`;
          }
        } else if (selectedStaff && selectedStaff !== 'all') {
          url += `?staffId=${selectedStaff}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [selectedDate, selectedStaff]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/business/services");
        const data = await res.json();
        setServices(data);
      } catch {}
    }
    async function fetchClients() {
      try {
        const res = await fetch("/api/business/patients");
        const data = await res.json();
        setClients(data);
      } catch {}
    }
    async function fetchStaff() {
      try {
        const res = await fetch("/api/business/staff");
        const data = await res.json();
        setStaffList(data);
      } catch {}
    }
    fetchServices();
    fetchClients();
    fetchStaff();
  }, []);

  function openAddModal() {
    setEditBooking(null);
    setShowModal(true);
  }
  function openEditModal(booking: Booking) {
    setEditBooking(booking);
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setEditBooking(null);
  }

  // Only show to staff
  if (!session?.user?.staffRole) {
    return <div className="p-8">You do not have permission to manage bookings.</div>;
  }

  // Group bookings by date (if you want to show multiple days at once, but here we show only selectedDate)
  const sortedBookings = Array.isArray(bookings) ? [...bookings].sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()) : [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="font-medium">Date:</label>
          <select
            className="border rounded p-2"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value={new Date().toISOString().slice(0, 10)}>{new Date().toISOString().slice(0, 10)}</option>
          </select>
          <label className="font-medium ml-4">Staff:</label>
          <select
            className="border rounded p-2"
            value={selectedStaff}
            onChange={e => setSelectedStaff(e.target.value)}
          >
            <option value="all">All Staff</option>
            {staffList.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <Button onClick={openAddModal} className="ml-4">
            <Calendar className="w-4 h-4 mr-1" /> Add Booking
          </Button>
        </div>
      </div>
      {loading ? (
        <div>Loading bookings...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : sortedBookings.length === 0 ? (
        <div className="text-gray-500">No bookings for this date.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.client?.name || <span className="text-gray-400 italic">No client</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.staff?.name || <span className="text-gray-400 italic">No staff</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.services?.map(s => s.name).join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{format(new Date(booking.scheduledFor), "yyyy-MM-dd HH:mm")}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={booking.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(booking)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 ml-2">Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <AddBookingStepperModal
          open={showModal}
          onClose={closeModal}
          onAddBooking={() => {
            // Refetch bookings after add/edit
            const today = selectedDate;
            let url = `/api/business/appointments?date=${today}`;
            if (selectedStaff && selectedStaff !== 'all') {
              url += `&staffId=${selectedStaff}`;
            }
            fetch(url)
              .then(res => res.json())
              .then(data => setBookings(data));
          }}
          editBooking={editBooking}
          services={services}
          clients={clients}
          staffList={staffList}
        />
      )}
    </div>
  );
} 