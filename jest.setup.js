import '@testing-library/jest-dom'

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
