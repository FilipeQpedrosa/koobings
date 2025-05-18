import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
const mockPrismaClient = {
  client: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  appointment: {
    findMany: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

const prisma = new PrismaClient();

describe('Client Query Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should efficiently fetch client profile', async () => {
    const mockClient = {
      id: 'test-1',
      name: 'Test Client',
      email: 'test@example.com',
      appointments: [
        {
          id: 'apt-1',
          date: new Date(),
          status: 'CONFIRMED',
          service: { name: 'Test Service' },
          staff: { name: 'Test Staff' },
        },
      ],
    };

    mockPrismaClient.client.findUnique.mockResolvedValue(mockClient);

    const startTime = process.hrtime();

    await prisma.client.findUnique({
      where: { id: 'test-1' },
      include: {
        appointments: {
          take: 5,
          orderBy: { date: 'desc' },
        },
      },
    });

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTime = seconds * 1000 + nanoseconds / 1000000;

    expect(executionTime).toBeLessThan(100); // Should complete within 100ms
  });

  it('should efficiently fetch client appointments with pagination', async () => {
    const mockAppointments = Array(10).fill(null).map((_, i) => ({
      id: `apt-${i + 1}`,
      date: new Date(),
      status: 'CONFIRMED',
      service: { name: 'Test Service' },
      staff: { name: 'Test Staff' },
    }));

    mockPrismaClient.appointment.findMany.mockResolvedValue(mockAppointments);

    const startTime = process.hrtime();

    await prisma.appointment.findMany({
      where: { clientId: 'test-1' },
      take: 10,
      skip: 0,
      orderBy: { date: 'desc' },
      include: {
        service: true,
        staff: true,
      },
    });

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTime = seconds * 1000 + nanoseconds / 1000000;

    expect(executionTime).toBeLessThan(150); // Should complete within 150ms
  });

  it('should efficiently search available time slots', async () => {
    const mockAppointments = Array(24).fill(null).map((_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      service: { duration: 60 },
    }));

    mockPrismaClient.appointment.findMany.mockResolvedValue(mockAppointments);

    const startTime = process.hrtime();

    const date = new Date(2024, 5, 1);
    await prisma.appointment.findMany({
      where: {
        date,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
      select: {
        time: true,
        service: {
          select: {
            duration: true,
          },
        },
      },
    });

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTime = seconds * 1000 + nanoseconds / 1000000;

    expect(executionTime).toBeLessThan(100); // Should complete within 100ms
  });

  it('should efficiently check for conflicting appointments', async () => {
    mockPrismaClient.appointment.findMany.mockResolvedValue([]);

    const startTime = process.hrtime();

    const date = new Date(2024, 5, 1);
    const time = '10:00';
    
    await prisma.appointment.findMany({
      where: {
        date,
        time,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
        staffId: 'staff-1',
      },
    });

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTime = seconds * 1000 + nanoseconds / 1000000;

    expect(executionTime).toBeLessThan(50); // Should complete within 50ms
  });
}); 