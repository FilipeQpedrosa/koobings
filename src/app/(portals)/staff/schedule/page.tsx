"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const localizer = momentLocalizer(moment);

export default function StaffSchedulePage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    if (!session?.user?.id) return;
    const res = await fetch(`/api/staff/appointments?staffId=${session.user.id}`);
    if (!res.ok) return setLoading(false);
    const data = await res.json();
    setEvents(
      data.map((apt: any) => ({
        id: apt.id,
        title: apt.serviceName || 'Appointment',
        start: new Date(apt.scheduledFor),
        end: moment(apt.scheduledFor).add(apt.duration, 'minutes').toDate(),
        allDay: false,
        ...apt,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [session]);

  // Set minTime to 8:00 AM
  const minTime = new Date();
  minTime.setHours(8, 0, 0, 0);

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Schedule</h1>
        <Button variant="outline" size="sm" onClick={fetchAppointments} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      {loading ? (
        <div>Loading schedule...</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          defaultView={typeof window !== 'undefined' && window.innerWidth < 640 ? 'week' : 'month'}
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
              <div><b>Service:</b> {selectedEvent?.serviceName}</div>
              <div><b>Status:</b> {selectedEvent?.status}</div>
              <div><b>Start:</b> {selectedEvent ? moment(selectedEvent.start).format('LLLL') : ''}</div>
              <div><b>End:</b> {selectedEvent ? moment(selectedEvent.end).format('LLLL') : ''}</div>
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