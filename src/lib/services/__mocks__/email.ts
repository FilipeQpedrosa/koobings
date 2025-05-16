// Mock email service for testing
export const mockEmailService = {
  send: jest.fn().mockResolvedValue([{ 
    statusCode: 202,
    headers: { 'x-message-id': 'test-message-id' },
    body: {}
  }])
};

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockImplementation((...args) => mockEmailService.send(...args))
}));

export const MOCK_SENDGRID_API_KEY = 'SG.mock_key_for_testing_purposes_only'; 