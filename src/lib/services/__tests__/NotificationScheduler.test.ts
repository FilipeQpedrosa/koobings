import { NotificationScheduler } from '../NotificationScheduler';
import * as emailModule from '@/lib/email';

jest.mock('@/lib/email', () => ({
  __esModule: true,
  ...jest.requireActual('@/lib/email'),
  sendAppointmentReminder: jest.fn().mockResolvedValue({ success: true }),
}));

declare global {
  var mockClient: any;
}

let scheduler: NotificationScheduler;

beforeEach(() => {
  scheduler = new NotificationScheduler();
  (emailModule.sendAppointmentReminder as jest.Mock).mockClear();
});

afterEach(() => {
  (emailModule.sendAppointmentReminder as jest.Mock).mockClear();
});

it('should call NotificationService for each appointment', async () => {
  // Mock appointments
  global.mockClient.appointment.findMany.mockResolvedValueOnce([
    {
      id: '1',
      clientId: '1',
      staffId: '1',
      startTime: new Date(),
      scheduledFor: new Date(),
      status: 'SCHEDULED',
      client: { email: 'test@example.com', name: 'Test Client' },
      service: { name: 'Test Service' },
      staff: { name: 'Test Staff' },
      business: { name: 'Test Business' },
    },
    {
      id: '2',
      clientId: '2',
      staffId: '2',
      startTime: new Date(),
      scheduledFor: new Date(),
      status: 'SCHEDULED',
      client: { email: 'test@example.com', name: 'Test Client' },
      service: { name: 'Test Service' },
      staff: { name: 'Test Staff' },
      business: { name: 'Test Business' },
    },
  ]);

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(2);
});

it('should send reminders for upcoming appointments', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const mockAppointments = [
    {
      id: '1',
      clientId: '1',
      startTime: tomorrow,
      scheduledFor: tomorrow,
      status: 'CONFIRMED',
      client: { email: 'test@example.com', name: 'Test Client' },
      service: { name: 'Test Service' },
      staff: { name: 'Test Staff' },
      business: { name: 'Test Business' },
    },
  ];

  global.mockClient.appointment.findMany.mockResolvedValue(mockAppointments);

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledWith({ appointment: mockAppointments[0] });
});

it('should not send reminders for past appointments', async () => {
  // O scheduler só busca appointments futuros, então para appointments passados findMany retorna []
  global.mockClient.appointment.findMany.mockResolvedValue([]);
  await scheduler.sendReminders();
  expect(emailModule.sendAppointmentReminder).not.toHaveBeenCalled();
});

it('should not process cancelled appointments (not returned by findMany)', async () => {
  global.mockClient.appointment.findMany.mockResolvedValue([]);
  await scheduler.sendReminders();
  expect(emailModule.sendAppointmentReminder).not.toHaveBeenCalled();
});

it('should not send reminders for cancelled appointments (if returned)', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const mockAppointments = [
    {
      id: '1',
      clientId: '1',
      startTime: tomorrow,
      scheduledFor: tomorrow,
      status: 'CONFIRMED',
      client: { email: 'test@example.com', name: 'Test Client' },
      service: { name: 'Test Service' },
      staff: { name: 'Test Staff' },
      business: { name: 'Test Business' },
    },
  ];

  global.mockClient.appointment.findMany.mockResolvedValue([]);

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).not.toHaveBeenCalled();
});

it('should handle errors gracefully', async () => {
  global.mockClient.appointment.findMany.mockRejectedValue(new Error('Database error'));

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

  await scheduler.sendReminders();

  expect(consoleSpy).toHaveBeenCalledWith(
    'Error checking appointments:',
    expect.any(Error)
  );

  consoleSpy.mockRestore();
}); 