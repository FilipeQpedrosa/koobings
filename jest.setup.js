// Polyfill TextEncoder/TextDecoder FIRST using require
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill ReadableStream/WritableStream for undici/fetch
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = require('stream/web').ReadableStream;
}
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = require('stream/web').WritableStream;
}

// Polyfill MessagePort/MessageChannel for undici/fetch (Node 18+)
if (typeof global.MessagePort === 'undefined') {
  const { MessagePort, MessageChannel } = require('worker_threads');
  global.MessagePort = MessagePort;
  global.MessageChannel = MessageChannel;
}

// Now require undici and polyfill fetch, Headers, Request, Response
const { fetch: undiciFetch, Headers: UndiciHeaders, Request: UndiciRequest, Response: UndiciResponse } = require('undici');
if (!globalThis.fetch) globalThis.fetch = undiciFetch;
if (!globalThis.Headers) globalThis.Headers = UndiciHeaders;
if (!globalThis.Request) globalThis.Request = UndiciRequest;
if (!globalThis.Response) globalThis.Response = UndiciResponse;

import '@testing-library/jest-dom'
import { MOCK_SENDGRID_API_KEY } from './src/lib/services/__mocks__/email';
import { configure } from '@testing-library/react';

// Set mock environment variables
process.env.SENDGRID_API_KEY = MOCK_SENDGRID_API_KEY;
process.env.EMAIL_FROM = 'test@example.com';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock environment variables
process.env = {
  ...process.env,
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test_secret',
};

// Mock PrismaClient (global para partilha entre instâncias e testes)
const mockClient = {
  client: {
    findUnique: jest.fn().mockImplementation(() => Promise.resolve({
      id: '1',
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'ACTIVE',
      preferences: {},
    })),
    update: jest.fn(),
    create: jest.fn(),
  },
  appointment: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  patient: {
    findUnique: jest.fn(),
  },
  business: {
    upsert: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  businessHours: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
  $use: jest.fn(),
  $disconnect: jest.fn(),
  staff: {
    findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Test Staff', email: 'staff@example.com' }),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn().mockResolvedValue({ id: '1', name: 'Test Staff', email: 'staff@example.com' }),
  },
  service: {
    findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Test Service', duration: 60 }),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn().mockResolvedValue({ id: '1', name: 'Test Service', duration: 60 }),
  },
  notification: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

global.mockClient = mockClient;

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockClient),
    StaffRole: { STANDARD: 'STANDARD', ADMIN: 'ADMIN' },
    AppointmentStatus: { SCHEDULED: 'SCHEDULED', CONFIRMED: 'CONFIRMED', CANCELLED: 'CANCELLED' },
  };
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  if (global.mockClient.client.findUnique) {
    global.mockClient.client.findUnique.mockClear();
  }
});
