import { format } from 'date-fns';
import { Appointment, Service, Patient } from '@prisma/client';

interface AppointmentWithDetails extends Appointment {
  service: Service;
  patient: Patient;
}

interface RecentAppointmentsProps {
  appointments: AppointmentWithDetails[];
}

export default function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No upcoming appointments</p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden">
      <div className="flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="py-5">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {appointment.service.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {format(new Date(appointment.startTime), 'PPP')} at{' '}
                  {format(new Date(appointment.startTime), 'p')}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Patient: {appointment.patient.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Status: <span className="capitalize">{appointment.status.toLowerCase()}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 