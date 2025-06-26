"use client";
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/custom-calendar.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AppointmentCalendar } from '@/components/Calendar/AppointmentCalendar';
import MobileMonthCalendar from '@/components/Calendar/MobileMonthCalendar';

const localizer = momentLocalizer(moment);

type StaffEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  clientName?: string;
  serviceName?: string;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function StaffSchedulePage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<StaffEvent[]>([]);
  const [monthlyEvents, setMonthlyEvents] = useState<StaffEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const isMobile = useIsMobile();

  const validStatuses = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
  ] as const;
  
  type AppointmentStatus = (typeof validStatuses)[number];

  // Helper to get the visible date range for the current view
  const getRangeForView = useCallback((date: Date, view: View) => {
    const m = moment(date);
    switch (view) {
      case 'week':
        return {
          start: m.clone().startOf('week').toDate(),
          end: m.clone().endOf('week').toDate(),
        };
      case 'day':
        return {
          start: m.clone().startOf('day').toDate(),
          end: m.clone().endOf('day').toDate(),
        };
      case 'agenda':
        return {
          start: m.clone().startOf('week').toDate(),
          end: m.clone().endOf('week').toDate(),
        };
      case 'month':
      default:
        return {
          start: m.clone().startOf('month').toDate(),
          end: m.clone().endOf('month').toDate(),
        };
    }
  }, []);

  const fetchAppointments = useCallback(async (start?: Date, end?: Date) => {
    setLoading(true);
    if (!session?.user?.id) return;
    try {
      let url = `/api/business/appointments?staffId=${session.user.id}`;
      if (start && end) {
        url += `&startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        console.error('Failed to fetch appointments:', res.statusText);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const newEvents = (data.data.appointments || []).map((apt: any) => ({
        id: apt.id,
        title: (apt.services?.[0]?.name) || 'Appointment',
        start: new Date(apt.scheduledFor),
        end: moment(apt.scheduledFor).add(apt.duration, 'minutes').toDate(),
        allDay: false,
        ...apt,
      }));
      setEvents(newEvents);
      setMonthlyEvents(newEvents);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      const initialRange = getRangeForView(date, view);
      if (!range) {
        setRange(initialRange);
      }
      fetchAppointments(range?.start, range?.end);
    }
  }, [status]);

  // Refetch when range changes
  useEffect(() => {
    if (range && status === 'authenticated') {
      fetchAppointments(range.start, range.end);
    }
  }, [range, status]);

  // Calendar navigation/view change handlers
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    const newRange = getRangeForView(newDate, view);
    setRange(newRange);
    fetchAppointments(newRange.start, newRange.end);
  };
  const handleView = (newView: View) => {
    setView(newView);
    const newRange = getRangeForView(date, newView);
    setRange(newRange);
    fetchAppointments(newRange.start, newRange.end);
  };

  // Set minTime to 8:00 AM
  const minTime = new Date();
  minTime.setHours(8, 0, 0, 0);

  // For AppointmentCalendar, convert events to its expected format
  const appointmentEvents = events.map(e => ({
    id: e.id,
    startTime: e.start.toISOString(),
    endTime: e.end.toISOString(),
    status: validStatuses.includes(e.status as any) ? (e.status as AppointmentStatus) : 'PENDING',
    client: { name: e.clientName || '' },
    service: { name: e.serviceName || e.title || '' },
    staff: { name: session?.user?.name || '' },
  }));

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8 w-full">
      <div className="flex items-center justify-between mb-4 mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold">My Schedule</h1>
        <Button variant="outline" size="sm" onClick={() => fetchAppointments(range?.start, range?.end)} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      {loading ? (
        <div>Loading schedule...</div>
      ) : isMobile ? (
        <MobileMonthCalendar
          appointments={appointmentEvents}
          selectedDate={date}
          onDateSelect={d => {
            setDate(d);
            const dayStart = moment(d).startOf('day');
            const dayEnd = moment(d).endOf('day');
            setEvents(
              monthlyEvents.filter(e =>
                moment(e.start).isBetween(dayStart, dayEnd, undefined, '[]')
              )
            );
          }}
          onEventSelect={apt => setSelectedEvent(apt)}
        />
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleView}
          min={minTime}
          popup
          toolbar
          onSelectEvent={event => setSelectedEvent(event)}
          messages={{
            month: 'Month',
            week: 'Week',
            day: 'Day',
            agenda: 'Agenda',
          }}
        />
      )}
      {/* Event details modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription asChild>
            <div>
              <div><b>Service:</b> {selectedEvent?.serviceName || selectedEvent?.service?.name || '—'}</div>
              <div><b>Status:</b> {selectedEvent?.status}</div>
              <div><b>Start:</b> {selectedEvent ? moment(selectedEvent.start || selectedEvent.startTime).format('LLLL') : ''}</div>
              <div><b>End:</b> {selectedEvent ? moment(selectedEvent.end || selectedEvent.endTime).format('LLLL') : ''}</div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setSelectedEvent(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 