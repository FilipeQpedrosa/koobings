import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import * as clientProfileHandler from '@/app/api/client/profile/route';
import * as clientAppointmentsHandler from '@/app/api/client/appointments/route';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('Client Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should require authentication for profile access', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const { req } = createMocks({
        method: 'GET',
      });

      const response = await clientProfileHandler.GET(
        new NextRequest(new Request(req.url || ''))
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Unauthorized',
      });
    });

    it('should require authentication for appointments access', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const { req } = createMocks({
        method: 'GET',
      });

      const response = await clientAppointmentsHandler.GET(
        new NextRequest(new Request(req.url || ''))
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Unauthorized',
      });
    });
  });

  describe('Authorization', () => {
    it('should only allow access to own profile', async () => {
      const mockSession = {
        user: {
          id: '1',
          role: 'CLIENT',
        },
      };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const { req } = createMocks({
        method: 'GET',
        query: {
          clientId: '2', // Trying to access different client's profile
        },
      });

      const response = await clientProfileHandler.GET(
        new NextRequest(new Request(req.url || ''))
      );

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Forbidden',
      });
    });

    it('should only allow access to own appointments', async () => {
      const mockSession = {
        user: {
          id: '1',
          role: 'CLIENT',
        },
      };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const { req } = createMocks({
        method: 'GET',
        query: {
          clientId: '2', // Trying to access different client's appointments
        },
      });

      const response = await clientAppointmentsHandler.GET(
        new NextRequest(new Request(req.url || ''))
      );

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Forbidden',
      });
    });
  });

  describe('Input Validation', () => {
    it('should validate profile update data', async () => {
      const mockSession = {
        user: {
          id: '1',
          role: 'CLIENT',
        },
      };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const { req } = createMocks({
        method: 'PUT',
        body: {
          name: '', // Invalid empty name
          phone: '1234567890',
        },
      });

      const response = await clientProfileHandler.PUT(
        new NextRequest(new Request(req.url || ''), {
          method: 'PUT',
          body: JSON.stringify({
            name: '',
            phone: '1234567890',
          }),
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Name is required',
      });
    });

    it('should sanitize input data', async () => {
      const mockSession = {
        user: {
          id: '1',
          role: 'CLIENT',
        },
      };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const { req } = createMocks({
        method: 'PUT',
        body: {
          name: '<script>alert("xss")</script>Test Name',
          phone: '1234567890',
        },
      });

      const response = await clientProfileHandler.PUT(
        new NextRequest(new Request(req.url || ''), {
          method: 'PUT',
          body: JSON.stringify({
            name: '<script>alert("xss")</script>Test Name',
            phone: '1234567890',
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.name).not.toContain('<script>');
    });
  });

  describe('Rate Limiting', () => {
    it('should limit repeated failed login attempts', async () => {
      // Simulate multiple failed login attempts
      const attempts = Array(5).fill(null).map(() => {
        const { req } = createMocks({
          method: 'POST',
          body: {
            email: 'test@example.com',
            password: 'wrongpassword',
          },
        });

        return clientProfileHandler.POST(
          new NextRequest(new Request(req.url || ''), {
            method: 'POST',
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'wrongpassword',
            }),
          })
        );
      });

      await Promise.all(attempts);

      // Try one more time
      const { req } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      });

      const response = await clientProfileHandler.POST(
        new NextRequest(new Request(req.url || ''), {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'wrongpassword',
          }),
        })
      );

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Too many login attempts. Please try again later.',
      });
    });
  });
}); 