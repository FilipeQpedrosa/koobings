import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime, generateTimeSlots } from '@/lib/utils'
import type { Service, Staff } from '@prisma/client'

interface AppointmentFormProps {
  services: Service[]
  staff: Staff[]
  onSubmit: (data: AppointmentFormData) => void
  defaultValues?: Partial<AppointmentFormData>
}

interface AppointmentFormData {
  serviceId: string
  staffId: string
  date: Date
  time: Date
}

export function AppointmentForm({
  services,
  staff,
  onSubmit,
  defaultValues,
}: AppointmentFormProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.find((s) => s.id === defaultValues?.serviceId) || null
  )
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(
    staff.find((s) => s.id === defaultValues?.staffId) || null
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValues?.date || null
  )
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    defaultValues?.time || null
  )

  // Generate time slots for the selected date
  const timeSlots = selectedDate
    ? generateTimeSlots(
        new Date(selectedDate.setHours(9, 0, 0)), // Start at 9 AM
        new Date(selectedDate.setHours(17, 0, 0)), // End at 5 PM
        selectedService?.duration || 30 // Use service duration or default to 30 minutes
      )
    : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) {
      return
    }

    onSubmit({
      serviceId: selectedService.id,
      staffId: selectedStaff.id,
      date: selectedDate,
      time: selectedTime,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Serviço</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedService?.id || ''}
            onChange={(e) =>
              setSelectedService(
                services.find((s) => s.id === e.target.value) || null
              )
            }
            required
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.duration}min
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profissional</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedStaff?.id || ''}
            onChange={(e) =>
              setSelectedStaff(staff.find((s) => s.id === e.target.value) || null)
            }
            required
          >
            <option value="">Selecione um profissional</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Data</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={selectedDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {selectedDate && timeSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Horário</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time.toISOString()}
                  type="button"
                  variant={
                    selectedTime?.toISOString() === time.toISOString()
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() => setSelectedTime(time)}
                >
                  {formatTime(time)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!selectedService || !selectedStaff || !selectedDate || !selectedTime}
      >
        Agendar
      </Button>
    </form>
  )
} 