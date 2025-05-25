"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

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

const mockBookings: Booking[] = [
  {
    id: "1",
    client: { id: "c1", name: "Alice Smith", email: "alice@example.com" },
    staff: { id: "s1", name: "John Doe" },
    services: [
      { id: "sv1", name: "Haircut" },
      { id: "sv2", name: "Shampoo" },
    ],
    scheduledFor: "2024-06-01T10:00:00Z",
    duration: 90,
    status: "CONFIRMED",
  },
  {
    id: "2",
    client: { id: "c2", name: "Bob Lee", email: "bob@example.com" },
    staff: { id: "s2", name: "Jane Smith" },
    services: [{ id: "sv3", name: "Massage" }],
    scheduledFor: "2024-06-02T14:00:00Z",
    duration: 60,
    status: "PENDING",
  },
];

const mockClients = [
  { id: "c1", name: "Alice Smith", email: "alice@example.com" },
  { id: "c2", name: "Bob Lee", email: "bob@example.com" },
];
const mockServices = [
  { id: "sv1", name: "Haircut", duration: 60 },
  { id: "sv2", name: "Shampoo", duration: 30 },
  { id: "sv3", name: "Massage", duration: 60 },
];
const statusOptions = ["PENDENTE", "CONFIRMADA", "CONCLUÍDA", "CANCELADA", "FALTA"];

function AddBookingStepperModal({ open, onClose, onAddBooking, editBooking, selectedDate, services, clients, onClientAdded }: { open: boolean; onClose: () => void; onAddBooking: (date: string) => void; editBooking?: Booking | null; selectedDate: string; services: { id: string; name: string; duration: number }[]; clients: { id: string; name: string; email: string; phone?: string }[]; onClientAdded: (client: any) => void }) {
  const [step, setStep] = useState(1);
  // Step 1: Client
  const [clientSearch, setClientSearch] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [client, setClient] = useState<{ id: string; name: string; email: string } | null>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", notes: "" });
  const [localClients, setLocalClients] = useState<typeof clients>(clients);
  // Step 2: Services
  const [selectedServices, setServicesState] = useState<string[]>([]);
  // Step 4: Staff & Scheduling
  const [staff, setStaff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState("PENDENTE");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [staffList, setStaffList] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    if (editBooking && open) {
      setStep(4);
      setClient(editBooking.client);
      setServicesState(editBooking.services.map(s => s.id));
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
      setStatus("PENDENTE");
      setNotes("");
    }
  }, [editBooking, open]);

  useEffect(() => {
    // Auto-calculate duration from selected services
    const total = selectedServices.reduce((sum, id) => {
      const svc = services.find((s) => s.id === id);
      return sum + (svc ? svc.duration : 0);
    }, 0);
    setDuration(total);
  }, [selectedServices, services]);

  useEffect(() => { setLocalClients(clients); }, [clients]);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch('/api/business/staff');
        if (!res.ok) throw new Error('Erro ao carregar funcionários');
        const data = await res.json();
        setStaffList(data.map((s: any) => ({ id: s.id, name: s.name, email: s.email })));
      } catch {
        setStaffList([]);
      }
    }
    fetchStaff();
  }, []);

  // Filter clients by search
  const filteredClients = localClients.filter(
    (c) =>
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
      const res = await fetch('/api/business/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao criar cliente');
      const created = await res.json();
      onClientAdded(created);
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
          setAvailabilityError('O funcionário já tem uma marcação neste horário. Por favor, escolha outro horário.');
        }
      } catch (err) {
        setAvailabilityError('Erro ao verificar disponibilidade.');
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
        await onAddBooking(selectedDate); // refetch bookings
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
        await onAddBooking(selectedDate); // refetch bookings
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
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return slots.filter(slot => {
        const [h, m] = slot.split(':').map(Number);
        const slotMinutes = h * 60 + m;
        return slotMinutes > currentMinutes;
      });
    }
    return slots;
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">{editBooking ? 'Editar Marcação' : 'Adicionar Marcação'}</h2>
        {!editBooking && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>1</div>
              <div className="text-sm font-medium mt-1">Cliente</div>
            </div>
            <div className="flex-1 border-t border-gray-200 mx-2" />
            <div className="flex gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>2</div>
              <div className="text-sm font-medium mt-1">Serviços</div>
            </div>
            <div className="flex-1 border-t border-gray-200 mx-2" />
            <div className="flex gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${step === 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>3</div>
              <div className="text-sm font-medium mt-1">Confirmação</div>
            </div>
            <div className="flex-1 border-t border-gray-200 mx-2" />
            <div className="flex gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${step === 4 ? 'bg-blue-600' : 'bg-gray-300'}`}>4</div>
              <div className="text-sm font-medium mt-1">Horário</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {editBooking ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente</label>
                <input className="block w-full border border-gray-200 rounded-md p-2 bg-gray-100" value={client?.name ? `${client.name} (${client.email})` : ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Funcionário</label>
                <input className="block w-full border border-gray-200 rounded-md p-2 bg-gray-100" value={staff && staffList.find(s => s.id === staff)?.name ? staffList.find(s => s.id === staff)?.name : ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Serviços</label>
                <input className="block w-full border border-gray-200 rounded-md p-2 bg-gray-100" value={services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(', ')} readOnly />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Data</label>
                  <input type="date" className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={date} min={format(new Date(), 'yyyy-MM-dd')} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                  <select className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={time} onChange={e => setTime(e.target.value)} required>
                    <option value="">Selecionar hora...</option>
                    {getTimeSlots().map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <select className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={status} onChange={e => setStatus(e.target.value)} required>
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notas</label>
                <textarea className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              {availabilityError && <div className="text-red-600 text-sm mt-2">{availabilityError}</div>}
              <div className="flex justify-between gap-2 mt-8">
                <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving || !!availabilityError}>{saving ? 'A guardar...' : 'Guardar Alterações'}</Button>
              </div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    {showAddClient ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200"
                          placeholder="Nome"
                          value={newClient.name}
                          onChange={e => setNewClient(nc => ({ ...nc, name: e.target.value }))}
                          required
                        />
                        <input
                          type="email"
                          className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200"
                          placeholder="Email"
                          value={newClient.email}
                          onChange={e => setNewClient(nc => ({ ...nc, email: e.target.value }))}
                          required
                        />
                        <input
                          type="tel"
                          className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200"
                          placeholder="Telemóvel (opcional)"
                          value={newClient.phone}
                          onChange={e => setNewClient(nc => ({ ...nc, phone: e.target.value }))}
                        />
                        <textarea
                          className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200"
                          placeholder="Notas (opcional)"
                          value={newClient.notes}
                          onChange={e => setNewClient(nc => ({ ...nc, notes: e.target.value }))}
                        />
                        <div className="flex gap-2 mt-2">
                          <Button type="button" variant="outline" onClick={() => setShowAddClient(false)}>Cancelar</Button>
                          <Button type="button" onClick={handleAddClient} className="flex items-center gap-1"><UserPlus className="w-4 h-4" />Adicionar Cliente</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <select
                          className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200"
                          value={client?.id || ""}
                          onChange={e => {
                            const found = localClients.find(c => c.id === e.target.value);
                            if (found) handleSelectClient(found);
                          }}
                        >
                          <option value="">Selecionar cliente...</option>
                          {localClients.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                          ))}
                        </select>
                        <div className="mt-2">
                          <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddClient(true)} className="flex items-center gap-1 text-blue-600"><UserPlus className="w-4 h-4" />Adicionar novo cliente</Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!client || showAddClient}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Serviços</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    {services.length === 0 ? (
                      <div className="text-gray-400">Nenhum serviço disponível.</div>
                    ) : services.map(s => (
                      <label key={s.id} className="flex items-center gap-2 py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                          checked={selectedServices.includes(s.id)}
                          onChange={e => {
                            if (e.target.checked) setServicesState(prev => [...prev, s.id]);
                            else setServicesState(prev => prev.filter(id => id !== s.id));
                          }}
                        />
                        <span>{s.name} <span className="text-xs text-gray-400">({s.duration} min)</span></span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={selectedServices.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 text-sm text-gray-500">Cliente</div>
                    <div className="font-semibold text-gray-800">{client?.name} <span className="text-xs text-gray-400">({client?.email})</span></div>
                    <div className="mt-4 mb-2 text-sm text-gray-500">Serviços</div>
                    <div className="font-semibold text-gray-800">{services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(", ")}</div>
                    <div className="mt-4 text-xs text-gray-500">Duração total: {duration} min</div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Funcionário</label>
                    <select
                      className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200"
                      value={staff}
                      onChange={e => setStaff(e.target.value)}
                      required
                    >
                      <option value="">Selecionar funcionário...</option>
                      {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Data</label>
                      <input type="date" className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={date} min={format(new Date(), 'yyyy-MM-dd')} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                      <select className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={time} onChange={e => setTime(e.target.value)} required>
                        <option value="">Selecionar hora...</option>
                        {getTimeSlots().map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                    <select className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={status} onChange={e => setStatus(e.target.value)} required>
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Notas</label>
                    <textarea className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200" value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                  {availabilityError && <div className="text-red-600 text-sm mt-2">{availabilityError}</div>}
                  <div className="flex justify-between gap-2 mt-8">
                    <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving || !!availabilityError}>{saving ? 'A guardar...' : 'Guardar Marcação'}</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    CONFIRMADA: 'bg-green-100 text-green-800',
    CONCLUÍDA: 'bg-blue-100 text-blue-800',
    CANCELADA: 'bg-gray-200 text-gray-600',
    FALTA: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
}

function DeleteBookingDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-red-600">Remover Marcação</h2>
        <p className="mb-4">Tem a certeza que deseja remover esta marcação? Esta ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>Remover</Button>
        </div>
      </div>
    </div>
  );
}

function CompleteBookingDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-green-700">Concluir Marcação</h2>
        <p className="mb-4">Tem a certeza que deseja marcar esta marcação como <b>concluída</b>?</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="button" className="bg-green-600 hover:bg-green-700 text-white" onClick={onConfirm}><CheckCircle2 className="w-4 h-4 mr-1" />Concluir</Button>
        </div>
      </div>
    </div>
  );
}

export default function BusinessBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);
  const [completeBookingId, setCompleteBookingId] = useState<string | null>(null);
  const [services, setServices] = useState<{ id: string; name: string; duration: number }[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string; email: string; phone?: string }[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/business/appointments?date=${selectedDate}`);
        if (!res.ok) throw new Error('Erro ao carregar marcações');
        const data = await res.json();
        // Transform backend data to Booking[] shape
        setBookings(data.map((apt: any) => ({
          id: apt.id,
          client: { name: apt.client?.name, email: apt.client?.email, id: apt.client?.id },
          staff: { id: apt.provider.id, name: apt.provider.name },
          services: [{ id: apt.service.id, name: apt.service.name }],
          scheduledFor: apt.date,
          duration: apt.service.duration,
          status: apt.status,
          notes: apt.notes,
        })));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar marcações');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [selectedDate]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/business/services');
        if (!res.ok) throw new Error('Erro ao carregar serviços');
        const data = await res.json();
        setServices(data.map((s: any) => ({ id: s.id, name: s.name, duration: s.duration })));
      } catch {
        setServices([]);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/business/clients');
        if (!res.ok) throw new Error('Erro ao carregar clientes');
        const data = await res.json();
        setClients(data.map((c: any) => ({ id: c.id, name: c.name, email: c.email, phone: c.phone })));
      } catch {
        setClients([]);
      }
    }
    fetchClients();
  }, []);

  async function handleAddBooking() {
    // Just refetch bookings for the selected date
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/business/appointments?date=${selectedDate}`);
      if (!res.ok) throw new Error('Erro ao carregar marcações');
      const data = await res.json();
      setBookings(data.map((apt: any) => ({
        id: apt.id,
        client: { name: apt.client?.name, email: apt.client?.email, id: apt.client?.id },
        staff: { id: apt.provider.id, name: apt.provider.name },
        services: [{ id: apt.service.id, name: apt.service.name }],
        scheduledFor: apt.date,
        duration: apt.service.duration,
        status: apt.status,
        notes: apt.notes,
      })));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar marcações');
    } finally {
      setLoading(false);
    }
  }

  function handleEditBooking(booking: Booking) {
    setEditBooking(booking);
    setShowAddModal(true);
  }

  function handleDeleteBooking() {
    if (deleteBookingId) {
      setBookings(prev => prev.filter(b => b.id !== deleteBookingId));
      setDeleteBookingId(null);
    }
  }

  function handleCompleteBooking() {
    if (completeBookingId) {
      setBookings(prev => prev.map(b => b.id === completeBookingId ? { ...b, status: 'CONCLUÍDA' } : b));
      setCompleteBookingId(null);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marcações</h1>
        <Button onClick={() => { setEditBooking(null); setShowAddModal(true); }}>Adicionar Marcação</Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Data:</label>
        <input
          type="date"
          className="border border-gray-300 rounded-md p-2"
          value={selectedDate}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>
      <AddBookingStepperModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setEditBooking(null); }}
        onAddBooking={handleAddBooking}
        editBooking={editBooking}
        selectedDate={selectedDate}
        services={services}
        clients={clients}
        onClientAdded={client => setClients(prev => [...prev, client])}
      />
      <DeleteBookingDialog
        open={!!deleteBookingId}
        onClose={() => setDeleteBookingId(null)}
        onConfirm={handleDeleteBooking}
      />
      <CompleteBookingDialog
        open={!!completeBookingId}
        onClose={() => setCompleteBookingId(null)}
        onConfirm={handleCompleteBooking}
      />
      {loading ? (
        <div className="text-gray-400">A carregar marcações...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-40">Cliente</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-32">Funcionário</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-40">Serviço(s)</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-44">Data/Hora & Duração</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-28">Estado</th>
                <th className="px-4 py-2 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-2 whitespace-nowrap max-w-[160px] truncate">
                    {booking.client && (booking.client.name || booking.client.email) ? (
                      <>
                        {booking.client.name || '-'}
                        {booking.client.email && (
                          <span className="text-xs text-gray-400"> ({booking.client.email})</span>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap max-w-[120px] truncate">{booking.staff.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap max-w-[180px] truncate">
                    {booking.services.map((s) => s.name).join(", ")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap max-w-[200px] truncate">
                    {new Date(booking.scheduledFor).toLocaleDateString()}<br />
                    <span className="text-xs text-gray-500">{new Date(booking.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {booking.duration} min</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right flex gap-1 justify-end">
                    {booking.status !== 'CONCLUÍDA' && (
                      <Button size="icon" className="bg-green-600 hover:bg-green-700 text-white" title="Concluir" onClick={() => setCompleteBookingId(booking.id)}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="sr-only">Concluir</span>
                      </Button>
                    )}
                    <Button size="icon" variant="outline" className="mr-1" title="Editar" onClick={() => handleEditBooking(booking)}>
                      <span className="sr-only">Editar</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"/></svg>
                    </Button>
                    <Button size="icon" variant="destructive" title="Remover" onClick={() => setDeleteBookingId(booking.id)}>
                      <span className="sr-only">Remover</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2m5 4v6m4-6v6"/></svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 