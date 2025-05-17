'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface StaffCalendarProps {
  staffId: string;
}

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
}

const StaffCalendar = ({ staffId }: StaffCalendarProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/staff/${staffId}/appointments`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        
        // Transform appointments into FullCalendar events
        const events = data.map((apt: any) => ({
          id: apt.id,
          title: `${apt.service.name} - ${apt.patient.name}`,
          start: apt.startTime,
          end: apt.endTime,
          status: apt.status,
          backgroundColor: apt.status === 'COMPLETED' ? '#10B981' : '#3B82F6',
        }));
        
        setAppointments(events);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [staffId]);

  return (
    <div className="h-full bg-white p-4 shadow sm:rounded-lg">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={appointments}
        height="100%"
      />
    </div>
  );
};

export default StaffCalendar; 