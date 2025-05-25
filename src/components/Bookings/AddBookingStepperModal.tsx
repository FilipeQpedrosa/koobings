import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { format } from 'date-fns';

const statusOptions = ["PENDENTE", "CONFIRMADA", "CONCLUÍDA", "CANCELADA", "FALTA"];

function AddBookingStepperModal({ open, onClose, onAddBooking, editBooking, selectedDate, services, clients, onClientAdded }: { open: boolean; onClose: () => void; onAddBooking: (date: string) => void; editBooking?: any | null; selectedDate: string; services: { id: string; name: string; duration: number }[]; clients: { id: string; name: string; email: string; phone?: string }[]; onClientAdded: (client: any) => void }) {
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
      setStatus("PENDENTE");
      setNotes("");
    }
  }, [editBooking, open]);

  useEffect(() => {
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
        await onAddBooking(selectedDate);
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
        await onAddBooking(selectedDate);
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
        {/* ...rest of the modal JSX as in the original component... */}
        {/* (You can paste the full JSX from the business page here) */}
      </div>
    </div>
  );
}

export default AddBookingStepperModal; 