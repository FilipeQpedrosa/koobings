import React, { useState, useEffect } from "react";
import { format } from 'date-fns';

function AddBookingStepperModal({ open, onClose, onAddBooking, editBooking, selectedDate, services, clients, onClientAdded }: { open: boolean; onClose: () => void; onAddBooking: (date: string) => void; editBooking?: any | null; selectedDate: string; services: { id: string; name: string; duration: number }[]; clients: { id: string; name: string; email: string; phone?: string }[]; onClientAdded: (client: any) => void }) {
  const [step, setStep] = useState(1);
  const [clientSearch, setClientSearch] = useState("");
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
  const [saveError, setSaveError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');

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
    }
  }

  if (!open) return null;

  // Stepper progress bar logic
  const totalSteps = 4;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
  const stepLabels = ['Cliente', 'Serviços', 'Confirmação', 'Horário'];

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
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              {stepLabels.map((label, idx) => (
                <div key={label} className="flex flex-col items-center flex-1">
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
        )}
        <form onSubmit={handleSubmit}>
          {/* ...rest of the form rendering as before... */}
          {/* Add error message for missing fields or save error */}
          {saveError && <div className="text-red-600 text-sm mb-2">{saveError}</div>}
          {/* ...rest of the form rendering as before... */}
          {/* In the final step, update the Add Booking button: */}
          {/* Example for step 4 (add this in the correct place): */}
          {/*
          <div className="flex justify-between gap-2 mt-8">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving || !client || !staff || !date || !time || selectedServices.length === 0 || !!availabilityError}>
              {saving ? <span className="flex items-center"><span className="loader mr-2" />A guardar...</span> : 'Guardar Marcação'}
            </Button>
          </div>
          */}
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
  );
}

export default AddBookingStepperModal; 