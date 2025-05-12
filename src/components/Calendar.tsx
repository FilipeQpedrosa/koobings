'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptLocale from '@fullcalendar/core/locales/pt';

interface CalendarProps {
  events?: Array<{
    id: string | number;
    title: string;
    start: string | Date;
    end: string | Date;
    color?: string;
  }>;
  onEventClick?: (eventInfo: any) => void;
  onDateSelect?: (selectInfo: any) => void;
  onDateClick?: (dateInfo: any) => void;
}

export default function Calendar({
  events = [],
  onEventClick,
  onDateSelect,
  onDateClick,
}: CalendarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      locale={ptLocale}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      expandRows={true}
      height="100%"
      events={events}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      eventClick={onEventClick}
      select={onDateSelect}
      dateClick={onDateClick}
      allDaySlot={false}
      slotDuration="00:30:00"
      slotLabelInterval="01:00"
      businessHours={{
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: '08:00',
        endTime: '20:00',
      }}
    />
  );
} 