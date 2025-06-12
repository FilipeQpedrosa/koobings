import CalendarClient from '@/components/CalendarClient';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export default function CalendarTestPage() {
  return (
    <div style={{ height: 600, padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Calendar Test</h1>
      <CalendarClient localizer={localizer} />
    </div>
  );
} 