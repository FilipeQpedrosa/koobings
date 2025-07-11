"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type DateRange } from "react-day-picker";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfToday, endOfToday } from "date-fns";

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
    PENDING: { label: 'Marcado', color: 'bg-yellow-200 text-yellow-800' },
    COMPLETED: { label: 'Concluído', color: 'bg-green-200 text-green-800' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-200 text-red-800' },
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
  const [serviceSearch, setServiceSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [_duration, _setDuration] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [_availabilityError, _setAvailabilityError] = useState('');

  useEffect(() => {
    if (editBooking && open) {
      setStep(3);
      setClient(editBooking.client);
      setServicesState(Array.isArray(editBooking.services) ? editBooking.services.map((s: any) => s.id) : []);
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
      (c.name?.toLowerCase() || '').includes(clientSearch.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(clientSearch.toLowerCase())
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
      const newClientData = created.data;
      setLocalClients((prev: any) => [...prev, newClientData]);
      setClient({ id: newClientData.id, name: newClientData.name, email: newClientData.email });
      setShowAddClient(false);
      setNewClient({ name: '', email: '', phone: '', notes: '' });
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao criar cliente');
    } finally {
      setSaving(false);
    }
  }

  // useEffect(() => {
  //   async function checkAvailability() {
  //     setAvailabilityError('');
  //     if (!staff || !date || !time || !duration) return;
  //     const startTime = new Date(date + 'T' + time).toISOString();
  //     try {
  //       const res = await fetch('/api/business/appointments/check-availability', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ staffId: staff, date, startTime, duration }),
  //       });
  //       const result = await res.json();
  //       if (result.data && !result.data.available) {
  //         setAvailabilityError('Staff is not available at this time.');
  //       }
  //     } catch (err) {
  //       setAvailabilityError('Error checking availability.');
  //     }
  //   }
  //   checkAvailability();
  //   let interval: NodeJS.Timeout | null = null;
  //   if (open) {
  //     interval = setInterval(checkAvailability, 15000); // every 15 seconds
  //   }
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [staff, date, time, duration, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitting booking...', { client, staff, date, time, selectedServices });
    if (!client || !staff || !date || !time || selectedServices.length === 0) return;
    setSaving(true);
    setSaveError('');
    try {
      if (editBooking) {
        const payload: any = {
          status,
          notes,
          scheduledFor: new Date(date + 'T' + time).toISOString(),
          serviceId: selectedServices[0],
          staffId: staff,
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

  // Stepper progress bar logic
  const totalSteps = 3;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
  const stepLabels = ['Client', 'Service', 'Schedule'];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl sm:max-w-xl h-auto max-h-[90vh] flex flex-col mx-2 animate-fade-in">
        <div className="sticky top-0 left-0 right-0 bg-white z-20 border-b px-4 pt-6 pb-2">
          <div className="mb-4">
            <div className="flex justify-between items-center relative">
              {stepLabels.map((label, idx) => (
                <div key={label + '-' + idx} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold z-10 ${step === idx + 1 ? 'bg-blue-600' : idx + 1 < step ? 'bg-blue-400' : 'bg-gray-300'}`}>{idx + 1}</div>
                  <span className={`mt-2 text-xs font-medium ${step === idx + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
                </div>
              ))}
              {/* Blue progress bar */}
              <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0 rounded-full" style={{marginLeft: '16px', marginRight: '16px'}}>
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 sm:px-8 pb-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Add error message for missing fields or save error */}
            {saveError && <div className="text-red-600 text-sm mb-2">{saveError}</div>}
            {step === 1 && (
              <div className="space-y-4">
                <div className="sticky top-0 bg-white z-10 pb-2">
                  <input
                    type="text"
                    placeholder="Search client by name or email..."
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    value={clientSearch}
                    onChange={e => setClientSearch(e.target.value)}
                  />
                  <button type="button" className="flex items-center gap-2 text-blue-600 hover:underline mt-2" onClick={() => setShowAddClient(true)}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                    Add new client
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredClients.map((c: any, idx: number) => (
                    <button type="button" key={c.id || c.email || idx} className={`flex items-center gap-3 p-3 w-full text-left ${client?.id === c.id ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition`} onClick={() => handleSelectClient(c)}>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {c.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base">{c.name}</div>
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
                  </div>
                )}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="border border-gray-300 rounded-lg p-2 flex-1"
                    value={serviceSearch}
                    onChange={e => setServiceSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {services
                    .filter((svc: any) =>
                      (!serviceSearch || svc.name.toLowerCase().includes(serviceSearch.toLowerCase()) || (svc.description && svc.description.toLowerCase().includes(serviceSearch.toLowerCase())))
                    )
                    .map((svc: any, idx: number) => (
                      <button
                        key={svc.id || idx}
                        type="button"
                        className={`flex flex-col items-start p-4 rounded-lg border transition shadow-sm relative text-left w-full ${selectedServices.includes(svc.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                        onClick={() => setServicesState([svc.id])}
                      >
                        <div className="font-semibold text-base mb-1 flex items-center gap-2">
                          {svc.name}
                          {selectedServices.includes(svc.id) && (
                            <span className="ml-2 text-blue-600">✔</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">Duration: {svc.duration} min{svc.price ? ` • €${svc.price}` : ''}</div>
                        {svc.description && <div className="text-xs text-gray-400 line-clamp-2">{svc.description}</div>}
                      </button>
                    ))}
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
                    <input type="date" className="w-full border rounded-lg p-2" value={date} min={format(new Date(), 'yyyy-MM-dd')} onChange={e => setDate(e.target.value)} />
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
              </div>
            )}
            {/* Action buttons inside the form */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t flex flex-col sm:flex-row justify-end gap-2 p-2 sm:p-4 z-10">
              {step > 1 && <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setStep(step - 1)}>Back</Button>}
              {step < 3 && <Button type="button" className="w-full sm:w-auto" onClick={() => setStep(step + 1)} disabled={step === 1 ? !client : selectedServices.length === 0}>Next</Button>}
              {step === 3 && (
                <>
                  <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" disabled={saving || !client || !staff || !date || !time || selectedServices.length === 0}>{saving ? <span className="flex items-center justify-center"><span className="loader mr-2" />Saving...</span> : (editBooking ? 'Save Changes' : 'Add Booking')}</Button>
                </>
              )}
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
            </div>
            {/* Add a simple spinner style if not present: */}
            <style jsx>{`
              .loader {
                border: 2px solid #f3f3f3;
                border-top: 2px solid #2563eb;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [staffFilter, setStaffFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  function fetchBookings(append = false) {
    setLoading(true);
    let url = `/api/business/appointments?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`;
    if (dateRange?.from) {
      url += `&startDate=${dateRange.from.toISOString()}`;
    }
    if (dateRange?.to) {
      url += `&endDate=${dateRange.to.toISOString()}`;
    }
    if (staffFilter && staffFilter !== 'ALL') {
      url += `&staffId=${staffFilter}`;
    }
    if (statusFilter && statusFilter !== 'ALL') {
      url += `&status=${statusFilter}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBookings(append ? [...bookings, ...data.data.appointments] : data.data.appointments);
        setHasMore(data.data.appointments.length === PAGE_SIZE);
      })
      .catch(() => console.error("Failed to fetch bookings"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchBookings(false);
  }, [dateFilter, staffFilter, statusFilter]);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const [servicesRes, clientsRes, staffRes] = await Promise.all([
          fetch("/api/business/services"),
          fetch("/api/business/patients"),
          fetch("/api/business/staff"),
        ]);
        const servicesData = await servicesRes.json();
        const clientsData = await clientsRes.json();
        const staffData = await staffRes.json();
        setServices(servicesData.data || []);
        setClients(clientsData.data || []);
        setStaffList(staffData.data || []);
      } catch (_err) {
        console.error("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  function handleShowMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBookings(true);
  }

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

  const filteredBookings = bookings; // Filtering is now done on the server

  const statusOptions = [
    { value: 'ALL', label: 'Todos os Status' },
    { value: 'PENDING', label: 'Marcado' },
    { value: 'COMPLETED', label: 'Concluído' },
    { value: 'CANCELLED', label: 'Cancelado' },
  ];

  const dateFilterOptions = [
    { value: 'ALL', label: 'Todas as Datas' },
    { value: 'TODAY', label: 'Hoje' },
    { value: 'THIS_WEEK', label: 'Esta Semana' },
    { value: 'THIS_MONTH', label: 'Este Mês' },
  ];

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    let newRange: DateRange | undefined;
    const today = new Date();
    switch (value) {
      case 'TODAY':
        newRange = { from: startOfToday(), to: endOfToday() };
        break;
      case 'THIS_WEEK':
        newRange = { from: startOfWeek(today), to: endOfWeek(today) };
        break;
      case 'THIS_MONTH':
        newRange = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
      default:
        newRange = undefined;
    }
    setDateRange(newRange);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Agendamentos
        </h1>
        <Button onClick={openAddModal}>
          <Plus className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Adicionar Agendamento</span>
        </Button>
      </header>

      <main>
        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <Select onValueChange={handleDateFilterChange} value={dateFilter}>
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="Todas as Datas" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="staff-filter" className="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
              <Select onValueChange={(value) => setStaffFilter(value)} value={staffFilter}>
                <SelectTrigger id="staff-filter">
                  <SelectValue placeholder="Todos os Funcionários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Funcionários</SelectItem>
                  {staffList.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select onValueChange={setStatusFilter} value={statusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando agendamentos...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Nenhum agendamento encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar seus filtros ou adicionar um novo agendamento.
            </p>
            <Button onClick={openAddModal} className="mt-4">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Agendamento
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{booking.client.name}</p>
                    <p className="text-sm text-gray-600">
                      Funcionário: {booking.staff.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(booking.scheduledFor), "PPP p")}
                    </p>
                    {booking.services && booking.services.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Serviço: {booking.services[0].name}
                      </p>
                    )}
                    {booking.notes && booking.notes.trim() !== "" && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-xs font-medium text-blue-800">Notas:</p>
                        <p className="text-sm text-blue-700">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(booking)}>Editar</Button>
                  <Button variant="destructive" size="sm">Remover</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-6">
            <Button onClick={handleShowMore} disabled={loading}>
              {loading ? 'Carregando...' : 'Mostrar Mais'}
            </Button>
          </div>
        )}
      </main>

      <AddBookingStepperModal
        open={showModal}
        onClose={closeModal}
        onAddBooking={fetchBookings}
        editBooking={editBooking}
        services={services}
        clients={clients}
        staffList={staffList}
      />
    </div>
  );
} 