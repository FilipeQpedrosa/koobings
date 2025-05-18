import { NotificationScheduler } from '../NotificationScheduler';
import { NotificationService } from '../NotificationService';
import { PrismaClient } from '@prisma/client';

jest.mock('../NotificationService');
jest.mock('@prisma/client');

describe('NotificationScheduler', () => {
  let scheduler: NotificationScheduler;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockNotificationService = new NotificationService() as jest.Mocked<NotificationService>;
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    scheduler = new NotificationScheduler(mockNotificationService, mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send reminders for upcoming appointments', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointments = [
      {
        id: '1',
        clientId: '1',
        startTime: tomorrow,
        status: 'CONFIRMED',
        client: {
          email: 'test@example.com',
          name: 'Test Client',
        },
      },
    ];

    mockPrisma.appointment.findMany.mockResolvedValue(mockAppointments);

    await scheduler.sendReminders();

    expect(mockNotificationService.sendAppointmentReminder).toHaveBeenCalledWith(
      mockAppointments[0]
    );
  });

  it('should not send reminders for past appointments', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mockAppointments = [
      {
        id: '1',
        clientId: '1',
        startTime: yesterday,
        status: 'CONFIRMED',
        client: {
          email: 'test@example.com',
          name: 'Test Client',
        },
      },
    ];

    mockPrisma.appointment.findMany.mockResolvedValue(mockAppointments);

    await scheduler.sendReminders();

    expect(mockNotificationService.sendAppointmentReminder).not.toHaveBeenCalled();
  });

  it('should not send reminders for cancelled appointments', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointments = [
      {
        id: '1',
        clientId: '1',
        startTime: tomorrow,
        status: 'CANCELLED',
        client: {
          email: 'test@example.com',
          name: 'Test Client',
        },
      },
    ];

    mockPrisma.appointment.findMany.mockResolvedValue(mockAppointments);

    await scheduler.sendReminders();

    expect(mockNotificationService.sendAppointmentReminder).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockPrisma.appointment.findMany.mockRejectedValue(new Error('Database error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await scheduler.sendReminders();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error sending appointment reminders:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
}); 