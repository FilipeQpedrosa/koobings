import { render, screen, fireEvent } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import ClientProfile from '@/app/(protected)/client/profile/page';

// Mock fetch
global.fetch = jest.fn();

describe('ClientProfile Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders loading state initially', () => {
    render(
      <SessionProvider session={null}>
        <ClientProfile />
      </SessionProvider>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays client information when loaded', async () => {
    const mockProfile = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'ACTIVE',
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })
    );

    render(
      <SessionProvider session={null}>
        <ClientProfile />
      </SessionProvider>
    );

    expect(await screen.findByDisplayValue('Test Client')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('handles edit mode correctly', async () => {
    const mockProfile = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'ACTIVE',
    };

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...mockProfile, name: 'Updated Name' }),
        })
      );

    render(
      <SessionProvider session={null}>
        <ClientProfile />
      </SessionProvider>
    );

    // Wait for profile to load
    await screen.findByDisplayValue('Test Client');

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Check if fields are enabled
    const nameInput = screen.getByDisplayValue('Test Client');
    const phoneInput = screen.getByDisplayValue('1234567890');
    expect(nameInput).not.toBeDisabled();
    expect(phoneInput).not.toBeDisabled();
    
    // Email should remain disabled
    expect(screen.getByDisplayValue('test@example.com')).toBeDisabled();

    // Make changes
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify save button is disabled during save
    expect(screen.getByText('Saving...')).toBeDisabled();

    // Verify changes are saved
    expect(await screen.findByDisplayValue('Updated Name')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    render(
      <SessionProvider session={null}>
        <ClientProfile />
      </SessionProvider>
    );

    expect(await screen.findByText('Failed to load profile')).toBeInTheDocument();
  });

  it('handles form validation', async () => {
    const mockProfile = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'ACTIVE',
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })
    );

    render(
      <SessionProvider session={null}>
        <ClientProfile />
      </SessionProvider>
    );

    // Wait for profile to load
    await screen.findByDisplayValue('Test Client');

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Clear required fields
    const nameInput = screen.getByDisplayValue('Test Client');
    fireEvent.change(nameInput, { target: { value: '' } });
    
    // Try to save
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify validation message
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });
}); 