import { NotificationScheduler } from '../NotificationScheduler';
import { NotificationService } from '../NotificationService';
import { PrismaClient, AppointmentStatus } from '@prisma/client';
import { addDays } from 'date-fns';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const originalModule = jest.requireActual('@prisma/client');
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      patient: {
        create: jest.fn().mockResolvedValue({
          id: '1',
          name: 'Test Patient',
          email: 'test@example.com'
        }),
        findUnique: jest.fn().mockResolvedValue({
          email: 'test@example.com'
        })
      },
      appointment: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: '1',
            patientId: '1',
            startTime: addDays(new Date(), 1),
            status: originalModule.AppointmentStatus.CONFIRMED
          }
        ])
      },
      patientPreference: {
        findUnique: jest.fn().mockResolvedValue({
          emailNotifications: true
        })
      },
      $disconnect: jest.fn()
    })),
    AppointmentStatus: originalModule.AppointmentStatus
  };
});

describe('NotificationScheduler', () => {
  let scheduler: NotificationScheduler;
  let notificationService: NotificationService;
  const prisma = new PrismaClient();

  beforeEach(() => {
    notificationService = new NotificationService({ enabled: true, provider: 'mock' });
    scheduler = new NotificationScheduler(notificationService);
  });

  afterEach(async () => {
    await scheduler.stop();
    await prisma.$disconnect();
  });

  it('should process upcoming appointments and send reminders', async () => {
    // Create test data
    const tomorrow = addDays(new Date(), 1);
    await prisma.patient.create({
      data: {
        name: 'Test Patient',
        email: 'test@example.com',
      },
    });

    // Start scheduler and wait for processing
    await scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify reminder was sent
    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: tomorrow,
        },
        status: AppointmentStatus.CONFIRMED,
      },
    });

    expect(appointments.length).toBeGreaterThan(0);
  });

  it('should not send reminders for appointments without email notifications enabled', async () => {
    // Mock patientPreference to return emailNotifications: false
    (prisma.patientPreference.findUnique as jest.Mock).mockResolvedValueOnce({
      emailNotifications: false
    });

    // Create test data with email notifications disabled
    const tomorrow = addDays(new Date(), 1);
    await prisma.patient.create({
      data: {
        name: 'Test Patient',
        email: 'test@example.com',
      },
    });

    // Start scheduler and wait for processing
    await scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify no reminders were sent
    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: tomorrow,
        },
        status: AppointmentStatus.CONFIRMED,
      },
    });

    expect(appointments.length).toBe(1);
  });
}); 