import '@testing-library/jest-dom'
import { MOCK_SENDGRID_API_KEY } from './src/lib/services/__mocks__/email';
import { TextEncoder, TextDecoder } from 'util';
import { configure } from '@testing-library/react';

// Set mock environment variables
process.env.SENDGRID_API_KEY = MOCK_SENDGRID_API_KEY;
process.env.EMAIL_FROM = 'test@example.com';

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock fetch
global.fetch = jest.fn();

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

// Mock PrismaClient
const mockClient = {
  client: {
    findUnique: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test Client',
      businessId: '1',
      phone: null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
};

// Mock the entire @prisma/client module
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    client: mockClient.client
  }))
}));

// Make mocks available globally
global.__mockClient = mockClient.client;

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  if (mockClient.client.findUnique) {
    mockClient.client.findUnique.mockClear();
  }
});
