import { GET, POST } from '@/app/api/business/hours/route';
import { prisma } from '@/lib/prisma';

// Mock getServerSession to always return a valid session for tests
jest.mock('next-auth', () => ({
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

// Mock state para simular o banco de dados em memória
let mockBusinessHours: any[] = [];

jest.mock('@/lib/prisma', () => ({
  prisma: {
    business: {
      upsert: jest.fn(async ({ create }) => create),
      delete: jest.fn(async ({ where }) => ({ id: where.id })),
    },
    businessHours: {
      count: jest.fn(async ({ where }) => mockBusinessHours.filter(h => h.businessId === where.businessId).length),
      findMany: jest.fn(async ({ where }) => mockBusinessHours.filter(h => h.businessId === where.businessId)),
      createMany: jest.fn(async ({ data }) => {
        mockBusinessHours.push(...data);
        return { count: data.length };
      }),
      deleteMany: jest.fn(async ({ where }) => {
        const before = mockBusinessHours.length;
        mockBusinessHours = mockBusinessHours.filter(h => h.businessId !== where.businessId);
        return { count: before - mockBusinessHours.length };
      }),
      create: jest.fn(async ({ data }) => {
        mockBusinessHours.push(data);
        return data;
      }),
    },
    $disconnect: jest.fn(),
  },
}));

beforeEach(() => {
  mockBusinessHours = [];
});

describe('Business Hours API', () => {
  beforeEach(async () => {
    await ensureTestBusiness();
    console.log('Business ensured for test:', testBusinessId);
    const count = await prisma.businessHours.count({ where: { businessId: testBusinessId } });
    console.log('Business hours count before test:', count);
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
    const body = JSON.stringify({
      hours: [
        { day: 1, isOpen: true, start: '09:00', end: '17:00' },
        { day: 2, isOpen: false, start: null, end: null },
      ],
    });
    const req = new Request('http://localhost/api/business/hours', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const dbHours = await prisma.businessHours.findMany({ where: { businessId: testBusinessId } });
    expect(dbHours.length).toBe(2);
    expect(dbHours[0].dayOfWeek).toBe(1);
    expect(dbHours[0].isOpen).toBe(true);
    expect(dbHours[0].startTime).toBe('09:00');
    expect(dbHours[0].endTime).toBe('17:00');
    expect(dbHours[1].isOpen).toBe(false);
  });

  it('should fetch business hours (GET)', async () => {
    await prisma.businessHours.createMany({
      data: [
        { businessId: testBusinessId, dayOfWeek: 1, isOpen: true, startTime: '09:00', endTime: '17:00' },
        { businessId: testBusinessId, dayOfWeek: 2, isOpen: false, startTime: null, endTime: null },
      ],
    });
    const req = new Request('http://localhost/api/business/hours', { method: 'GET' });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data).toBeDefined();
    expect(data.data.length).toBe(2);
    expect(data.data[0]).toMatchObject({ day: 1, isOpen: true, start: '09:00', end: '17:00' });
    expect(data.data[1]).toMatchObject({ day: 2, isOpen: false, start: null, end: null });
  });

  it('should return validation error for invalid input', async () => {
    const body = JSON.stringify({
      hours: [
        { day: 1, isOpen: true, start: '25:00', end: '17:00' },
      ],
    });
    const req = new Request('http://localhost/api/business/hours', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
    expect(data.error.details).toBeDefined();
  });

  it('should overwrite existing hours on POST', async () => {
    await prisma.businessHours.create({
      data: { businessId: testBusinessId, dayOfWeek: 1, isOpen: true, startTime: '08:00', endTime: '12:00' },
    });
    const body = JSON.stringify({
      hours: [
        { day: 1, isOpen: true, start: '09:00', end: '17:00' },
      ],
    });
    const req = new Request('http://localhost/api/business/hours', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const dbHours = await prisma.businessHours.findMany({ where: { businessId: testBusinessId } });
    expect(dbHours.length).toBe(1);
    expect(dbHours[0].startTime).toBe('09:00');
    expect(dbHours[0].endTime).toBe('17:00');
  });
}); 