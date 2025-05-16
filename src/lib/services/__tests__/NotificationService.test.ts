import { NotificationService } from '../NotificationService';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    patient: {
      findUnique: jest.fn().mockResolvedValue({
        email: 'test@example.com'
      })
    }
  }))
}));

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const consoleSpy = jest.spyOn(console, 'log');
  
  const mockAppointment = {
    id: '1',
    businessId: '1',
    patientId: '1',
    staffId: '1',
    serviceId: '1',
    startTime: new Date(),
    endTime: new Date(),
    status: 'SCHEDULED',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Create a new instance for each test
    notificationService = new NotificationService({ enabled: true, provider: 'mock' });
    consoleSpy.mockClear(); // Clear the mock before each test
  });

  afterAll(() => {
    consoleSpy.mockRestore(); // Restore the original console.log after all tests
  });

  describe('sendAppointmentConfirmation', () => {
    it('should send confirmation email successfully', async () => {
      const result = await notificationService.sendAppointmentConfirmation(mockAppointment);
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('📧 MOCK EMAIL SENT');
    });

    it('should not send email when disabled', async () => {
      notificationService = new NotificationService({ enabled: false, provider: 'mock' });
      const result = await notificationService.sendAppointmentConfirmation(mockAppointment);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Notifications disabled');
    });

    it('should throw error when patient email not found', async () => {
      (PrismaClient as jest.Mock).mockImplementationOnce(() => ({
        patient: {
          findUnique: jest.fn().mockResolvedValue(null)
        }
      }));
      notificationService = new NotificationService({ enabled: true, provider: 'mock' });
      await expect(
        notificationService.sendAppointmentConfirmation(mockAppointment)
      ).rejects.toThrow('Patient email not found');
    });
  });

  describe('sendAppointmentReminder', () => {
    it('should send reminder email successfully', async () => {
      const result = await notificationService.sendAppointmentReminder(mockAppointment);
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('📧 MOCK EMAIL SENT');
    });
  });

  describe('sendAppointmentCancellation', () => {
    it('should send cancellation email successfully', async () => {
      const result = await notificationService.sendAppointmentCancellation(mockAppointment);
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('📧 MOCK EMAIL SENT');
    });
  });
}); 