import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AppointmentForm } from '@/components/forms/AppointmentForm'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

// This would come from your database
const mockServices = [
  {
    id: '1',
    name: 'Corte de Cabelo',
    duration: 30,
    price: 25,
  },
  {
    id: '2',
    name: 'Barba',
    duration: 20,
    price: 15,
  },
]

const mockStaff = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
  },
]

const mockAppointments = [
  {
    id: '1',
    service: mockServices[0],
    staff: mockStaff[0],
    client: {
      name: 'Pedro Costa',
      email: 'pedro@example.com',
    },
    startTime: new Date('2024-02-20T10:00:00'),
    status: 'CONFIRMED',
  },
  {
    id: '2',
    service: mockServices[1],
    staff: mockStaff[1],
    client: {
      name: 'Ana Silva',
      email: 'ana@example.com',
    },
    startTime: new Date('2024-02-20T14:30:00'),
    status: 'PENDING',
  },
]

export default function AppointmentsPage() {
  const handleNewAppointment = (data: any) => {
    console.log('New appointment:', data)
    // Here you would typically make an API call to create the appointment
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <Button>Novo Agendamento</Button>
        </div>

        {/* Today's Appointments */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Agendamentos de Hoje</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">{appointment.client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.service.name}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      appointment.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {appointment.status === 'CONFIRMED'
                      ? 'Confirmado'
                      : 'Pendente'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Data: </span>
                    {formatDate(appointment.startTime)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Horário: </span>
                    {formatTime(appointment.startTime)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Profissional: </span>
                    {appointment.staff.name}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Appointment Form */}
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold mb-4">Novo Agendamento</h2>
          <AppointmentForm
            services={mockServices as any}
            staff={mockStaff as any}
            onSubmit={handleNewAppointment}
          />
        </div>
      </div>
    </DashboardLayout>
  )
} 