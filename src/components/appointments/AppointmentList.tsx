interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  provider: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
  };
}

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No appointments found for today.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {appointments.map((apt) => (
        <li key={apt.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm">
          <div>
            <div className="font-semibold">{apt.clientName}</div>
            <div className="text-sm text-muted-foreground">{apt.clientEmail}</div>
            <div className="text-sm mt-1">Service: {apt.service?.name ?? 'N/A'}</div>
            <div className="text-sm">Provider: {apt.provider?.name ?? 'N/A'}</div>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <div className="font-mono text-lg">{apt.time}</div>
            <div className="text-xs text-muted-foreground">{apt.date.slice(0, 10)}</div>
            <div className="text-xs mt-1">Status: {apt.status}</div>
          </div>
        </li>
      ))}
    </ul>
  );
} 