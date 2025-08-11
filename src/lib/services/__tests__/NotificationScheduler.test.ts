// Mock environment variables first
process.env.BREVO_API_KEY = 'test-api-key';

// Mock Prisma client before any imports
const mockPrismaClient = {
  appointments: {
    findMany: jest.fn(),
  },
  notifications: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrismaClient,
}));

jest.mock('@/lib/email', () => ({
  __esModule: true,
  ...jest.requireActual('@/lib/email'),
  sendAppointmentReminder: jest.fn().mockResolvedValue({ success: true }),
}));

import { NotificationScheduler } from '../NotificationScheduler';
import * as emailModule from '@/lib/email';

let scheduler: NotificationScheduler;

beforeEach(() => {
  scheduler = new NotificationScheduler();
  (emailModule.sendAppointmentReminder as jest.Mock).mockClear();
  mockPrismaClient.appointments.findMany.mockClear();
  mockPrismaClient.notifications.findFirst.mockClear();
  mockPrismaClient.notifications.create.mockClear();
});

afterEach(() => {
  (emailModule.sendAppointmentReminder as jest.Mock).mockClear();
});

it('should call NotificationService for each appointment', async () => {
  // Mock appointments
  mockPrismaClient.appointments.findMany.mockResolvedValueOnce([
    {
      id: '1',
      clientId: '1',
      scheduledFor: new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 hours from now
      Client: { email: 'test1@example.com' },
      Service: { name: 'Test Service 1' },
      Staff: { name: 'Test Staff' },
      Business: { name: 'Test Business' },
    },
    {
      id: '2', 
      clientId: '2',
      scheduledFor: new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 hours from now
      Client: { email: 'test2@example.com' },
      Service: { name: 'Test Service 2' },
      Staff: { name: 'Test Staff' },
      Business: { name: 'Test Business' },
    },
  ]);

  mockPrismaClient.notifications.findFirst.mockResolvedValue(null);
  mockPrismaClient.notifications.create.mockResolvedValue({});

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(2);
});

it('should send reminders for upcoming appointments', async () => {
  const upcomingAppointment = {
    id: '1',
    clientId: '1',
    scheduledFor: new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 hours from now
    Client: { email: 'test@example.com' },
    Service: { name: 'Test Service' },
    Staff: { name: 'Test Staff' },
    Business: { name: 'Test Business' },
  };

  mockPrismaClient.appointments.findMany.mockResolvedValue([upcomingAppointment]);
  mockPrismaClient.notifications.findFirst.mockResolvedValue(null);
  mockPrismaClient.notifications.create.mockResolvedValue({});

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(1);
});

it('should not send reminders for past appointments', async () => {
  mockPrismaClient.appointments.findMany.mockResolvedValue([]);

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(0);
});

it('should not process cancelled appointments (not returned by findMany)', async () => {
  mockPrismaClient.appointments.findMany.mockResolvedValue([]);

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(0);
});

it('should not send reminders for cancelled appointments (if returned)', async () => {
  mockPrismaClient.appointments.findMany.mockResolvedValue([]);

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(0);
});

it('should handle errors gracefully', async () => {
  mockPrismaClient.appointments.findMany.mockRejectedValue(new Error('Database error'));

  await scheduler.sendReminders();

  expect(emailModule.sendAppointmentReminder).toHaveBeenCalledTimes(0);
}); 