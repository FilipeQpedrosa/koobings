"use client";
import { Calendar } from 'react-big-calendar';
import type { ComponentProps } from 'react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

type CalendarEvent = { start: Date; end: Date; [key: string]: any };

// Note: The localizer should be passed in via props, not set here.

export default function CalendarClient(
  props: ComponentProps<typeof Calendar<CalendarEvent, object>>
) {
  return (
    <Calendar<CalendarEvent, object>
      events={[]}
      startAccessor={(event) => event.start}
      endAccessor={(event) => event.end}
      defaultView="week"
      popup
      toolbar
      style={{ height: 600 }}
      {...props}
    />
  );
}