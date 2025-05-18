import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import * as clientProfileHandler from '@/app/api/client/profile/route';
import * as clientAppointmentsHandler from '@/app/api/client/appointments/route';
import * as clientBookingHandler from '@/app/api/client/bookings/route';
import prisma from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  client: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  appointment: {
    findMany: jest.fn(),
    create: jest.fn(),
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
      };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/profile');
      const response = await clientProfileHandler.GET(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockClient);
    });

    it('should handle client not found', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/profile');
      const response = await clientProfileHandler.GET(request);

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Client not found',
      });
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

      const response = await clientProfileHandler.PUT(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(updatedClient);
    });
  });

  describe('GET /api/client/appointments', () => {
    it('should return client appointments', async () => {
      const mockAppointments = [
        {
          id: '1',
          date: '2024-05-20',
          time: '10:00',
          status: 'CONFIRMED',
          service: { name: 'Test Service', duration: 60 },
          staff: { name: 'Test Staff' },
        },
      ];

      (prisma.appointment.findMany as jest.Mock).mockResolvedValue(mockAppointments);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'CLIENT' },
      });

      const request = new Request('http://localhost:3000/api/client/appointments');
      const response = await clientAppointmentsHandler.GET(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockAppointments);
    });
  });

  describe('POST /api/client/bookings', () => {
    it('should create new booking', async () => {
      const newBooking = {
        id: '1',
        date: '2024-05-20',
        time: '10:00',
        status: 'PENDING',
      };

      (prisma.appointment.create as jest.Mock).mockResolvedValue(newBooking);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          date: '2024-05-20',
          time: '10:00',
          serviceId: '1',
          staffId: '1',
        },
      });

      await clientBookingHandler.POST(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(newBooking);
    });
  });
}); 