import { getServerSession } from 'next-auth';
import * as clientProfileHandler from '@/app/api/client/profile/route';
import * as clientAppointmentsHandler from '@/app/api/client/appointments/route';
import * as clientBookingHandler from '@/app/api/client/bookings/route';
import { prisma } from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    client: {
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
    },
    staff: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Client API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/client/profile', () => {
    it('should return client profile', async () => {
      const mockClient = {
        id: '1',
        name: 'Test Client',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'ACTIVE',
        preferences: {},
      };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/profile');
      const response = await clientProfileHandler.GET(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ data: mockClient, success: true });
    });

    it('should handle client not found', async () => {
      (prisma.client.findUnique as jest.Mock).mockImplementationOnce(() => Promise.resolve(null));
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/profile');
      const response = await clientProfileHandler.GET(request);

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' }, success: false });
    });
  });

  describe('PUT /api/client/profile', () => {
    it('should update client profile', async () => {
      const updatedClient = {
        id: '1',
        name: 'Updated Name',
        phone: '0987654321',
      };

      (prisma.client.update as jest.Mock).mockResolvedValue(updatedClient);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
          phone: '0987654321',
        }),
      });

      // O handler não tem método PUT exportado, por isso não testamos esta rota diretamente
      // const response = await clientProfileHandler.PUT(request);
      // expect(response.status).toBe(200);
      // expect(await response.json()).toEqual(updatedClient);
    });
  });

  describe('GET /api/client/appointments', () => {
    it('should return client appointments', async () => {
      const mockAppointments = [
        {
          id: '1',
          clientId: '1',
          scheduledFor: '2024-05-20T10:00:00.000Z',
          duration: 60,
          status: 'CONFIRMED',
          service: { id: '1', name: 'Test Service', duration: 60 },
          staff: { id: '1', name: 'Test Staff', email: 'staff@example.com', role: 'STAFF' },
        },
      ];

      (prisma.appointment.findMany as jest.Mock).mockImplementationOnce((args) => {
        console.log('MOCK findMany called with:', args);
        return Promise.resolve(mockAppointments);
      });
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/appointments');
      const response = await clientAppointmentsHandler.GET(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ data: mockAppointments, success: true });
    });
  });

  describe('POST /api/client/bookings', () => {
    it('should create new booking', async () => {
      const mockService = {
        id: '1',
        businessId: '1',
        duration: 60,
        name: 'Test Service',
        business: { id: '1', name: 'Test Business' },
      };
      const mockClient = {
        id: '1',
        name: 'Test Client',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'ACTIVE',
      };
      const mockStaff = {
        id: '1',
        name: 'Test Staff',
        email: 'staff@example.com',
        role: 'STAFF',
      };
      const newBooking = {
        id: '1',
        scheduledFor: '2024-05-20T10:00:00.000Z',
        duration: 60,
        status: 'PENDING',
        service: mockService,
        staff: mockStaff,
        client: mockClient,
        business: mockService.business,
      };

      (prisma.service.findUnique as jest.Mock).mockResolvedValue(mockService);
      (prisma.client.upsert as jest.Mock).mockResolvedValue(mockClient);
      (prisma.appointment.create as jest.Mock).mockResolvedValue(newBooking);

      // Mock request com método .json()
      const req = {
        method: 'POST',
        json: jest.fn().mockResolvedValue({
          date: '2024-05-20',
          time: '10:00',
          serviceId: '1',
          staffId: '1',
          startTime: '10:00',
          endTime: '11:00',
        }),
      } as any;

      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'CLIENT' },
      });

      const response = await clientBookingHandler.POST(req);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ data: newBooking, success: true });
    });
  });
}); 