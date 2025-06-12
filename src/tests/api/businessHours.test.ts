import { testApiHandler } from 'next-test-api-route-handler';
import { GET, POST } from '@/app/api/business/hours/route';
import { prisma } from '@/lib/prisma';

// Mock getServerSession to always return a valid session for tests
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: { id: 'test-business-id', email: 'test@business.com' }
  })),
}));

const testBusinessId = 'test-business-id';
const testUser = { id: testBusinessId, email: 'test@business.com' };

// Helper to insert a test business
async function ensureTestBusiness() {
  await prisma.business.upsert({
    where: { id: testBusinessId },
    update: {},
    create: {
      id: testBusinessId,
      name: 'Test Business',
      email: testUser.email,
      passwordHash: 'hashed',
      type: 'HAIR_SALON',
      status: 'ACTIVE',
    },
  });
}

describe('Business Hours API', () => {
  beforeAll(async () => {
    await ensureTestBusiness();
  });

  afterEach(async () => {
    await prisma.businessHours.deleteMany({ where: { businessId: testBusinessId } });
  });

  afterAll(async () => {
    await prisma.businessHours.deleteMany({ where: { businessId: testBusinessId } });
    await prisma.business.delete({ where: { id: testBusinessId } });
    await prisma.$disconnect();
  });

  it('should create business hours (POST)', async () => {
    await testApiHandler({
      request: async (req, res) => {
        req.method = 'POST';
        req.headers = { 'content-type': 'application/json' };
        req.body = JSON.stringify({
          hours: [
            { day: 1, isOpen: true, start: '09:00', end: '17:00' },
            { day: 2, isOpen: false, start: null, end: null },
          ],
        });
        await POST(req, res);
      },
      test: async ({ res }) => {
        expect(res.statusCode).toBe(200);
        const dbHours = await prisma.businessHours.findMany({ where: { businessId: testBusinessId } });
        expect(dbHours.length).toBe(2);
        expect(dbHours[0].dayOfWeek).toBe(1);
        expect(dbHours[0].isOpen).toBe(true);
        expect(dbHours[0].startTime).toBe('09:00');
        expect(dbHours[0].endTime).toBe('17:00');
        expect(dbHours[1].isOpen).toBe(false);
      },
    });
  });

  it('should fetch business hours (GET)', async () => {
    await prisma.businessHours.createMany({
      data: [
        { businessId: testBusinessId, dayOfWeek: 1, isOpen: true, startTime: '09:00', endTime: '17:00' },
        { businessId: testBusinessId, dayOfWeek: 2, isOpen: false, startTime: null, endTime: null },
      ],
    });
    await testApiHandler({
      request: async (req, res) => {
        req.method = 'GET';
        await GET(req, res);
      },
      test: async ({ res }) => {
        expect(res.statusCode).toBe(200);
        const data = res._getJSONData();
        expect(data.hours).toBeDefined();
        expect(data.hours.length).toBe(2);
        expect(data.hours[0]).toMatchObject({ day: 1, isOpen: true, start: '09:00', end: '17:00' });
        expect(data.hours[1]).toMatchObject({ day: 2, isOpen: false, start: null, end: null });
      },
    });
  });

  it('should return validation error for invalid input', async () => {
    await testApiHandler({
      request: async (req, res) => {
        req.method = 'POST';
        req.headers = { 'content-type': 'application/json' };
        req.body = JSON.stringify({
          hours: [
            { day: 1, isOpen: true, start: '25:00', end: '17:00' },
          ],
        });
        await POST(req, res);
      },
      test: async ({ res }) => {
        expect(res.statusCode).toBe(400);
        const data = res._getJSONData();
        expect(data.errors).toBeDefined();
      },
    });
  });

  it('should overwrite existing hours on POST', async () => {
    await prisma.businessHours.create({
      data: { businessId: testBusinessId, dayOfWeek: 1, isOpen: true, startTime: '08:00', endTime: '12:00' },
    });
    await testApiHandler({
      request: async (req, res) => {
        req.method = 'POST';
        req.headers = { 'content-type': 'application/json' };
        req.body = JSON.stringify({
          hours: [
            { day: 1, isOpen: true, start: '09:00', end: '17:00' },
          ],
        });
        await POST(req, res);
      },
      test: async ({ res }) => {
        expect(res.statusCode).toBe(200);
        const dbHours = await prisma.businessHours.findMany({ where: { businessId: testBusinessId } });
        expect(dbHours.length).toBe(1);
        expect(dbHours[0].startTime).toBe('09:00');
        expect(dbHours[0].endTime).toBe('17:00');
      },
    });
  });
}); 