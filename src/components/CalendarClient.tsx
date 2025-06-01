"use client";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarClient(props) {
  return (
    <Calendar
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      defaultView="week"
      popup
      toolbar
      style={{ height: 600 }}
      {...props}
    />
  );
} 