import CalendarClient from '@/components/CalendarClient';

export default function CalendarTestPage() {
  return (
    <div style={{ height: 600, padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Calendar Test</h1>
      <CalendarClient />
    </div>
  );
} 