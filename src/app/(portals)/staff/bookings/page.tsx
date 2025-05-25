"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

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
  const [clientSearch, setClientSearch] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [client, setClient] = useState<{ id: string; name: string; email: string } | null>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", notes: "" });
  const [localClients, setLocalClients] = useState<typeof clients>(clients);
  const [selectedServices, setServicesState] = useState<string[]>([]);
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
    const total = selectedServices.reduce((sum, id) => {
      const svc = services.find((s: any) => s.id === id);
      return sum + (svc ? svc.duration : 0);
    }, 0);
    setDuration(total);
  }, [selectedServices, services]);

  useEffect(() => { setLocalClients(clients); }, [clients]);

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
        onAddBooking();
        onClose();
      } else {
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
        onAddBooking();
        onClose();
      }
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao guardar marcação');
    } finally {
      setSaving(false);
    }
  }

  function getTimeSlots() {
    const slots = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        slots.push(`${hour}:${min}`);
      }
    }
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s, idx) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200 ${step === s ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-500'} ${idx !== 0 ? 'ml-2' : ''}`}>{s}</div>
              <span className={`mt-2 text-xs font-medium ${step === s ? 'text-blue-600' : 'text-gray-400'}`}>{['Client', 'Service', 'Schedule'][s-1]}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client by name or email..."
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  value={clientSearch}
                  onChange={e => setClientSearch(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </span>
              </div>
              <button type="button" className="flex items-center gap-2 text-blue-600 hover:underline" onClick={() => setShowAddClient(true)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                Add new client
              </button>
              <div className="max-h-40 overflow-y-auto grid grid-cols-1 gap-2">
                {filteredClients.map((c: any) => (
                  <button type="button" key={c.id} className={`flex items-center gap-3 p-3 rounded-lg border transition ${client?.id === c.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => handleSelectClient(c)}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {c.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.email}</div>
                    </div>
                  </button>
                ))}
              </div>
              {showAddClient && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 space-y-2 animate-fade-in">
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
          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-2 font-medium text-gray-700">Select a service:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((svc: any) => (
                  <button
                    key={svc.id}
                    type="button"
                    className={`flex flex-col items-start p-4 rounded-lg border transition shadow-sm ${selectedServices.includes(svc.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    onClick={() => setServicesState([svc.id])}
                  >
                    <div className="font-semibold text-base mb-1">{svc.name}</div>
                    <div className="text-xs text-gray-500">Duration: {svc.duration} min</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => setStep(3)} disabled={selectedServices.length === 0}>Next</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-2 font-medium text-gray-700">Schedule</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                  <select className="w-full border rounded-lg p-2" value={staff} onChange={e => setStaff(e.target.value)}>
                    <option value="">Select staff</option>
                    {staffList.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full border rounded-lg p-2" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select className="w-full border rounded-lg p-2" value={time} onChange={e => setTime(e.target.value)}>
                    <option value="">Select time</option>
                    {getTimeSlots().map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {editBooking && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full border rounded-lg p-2" value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="PENDING">Booked</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea placeholder="Notes" className="w-full border rounded-lg p-2" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              {availabilityError && <div className="text-red-600 text-sm mt-2">{availabilityError}</div>}
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" disabled={saving || !client || !staff || !date || !time || selectedServices.length === 0 || !!availabilityError}>{editBooking ? 'Save Changes' : 'Add Booking'}</Button>
              </div>
              {saveError && <div className="text-red-600 text-sm mt-2">{saveError}</div>}
            </div>
          )}
        </form>
        <div className="flex justify-end mt-8">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default function StaffBookingsPage() {
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