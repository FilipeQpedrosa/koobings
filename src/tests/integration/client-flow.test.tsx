import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientProfile from '../../components/client/ClientProfile';
import ClientAppointments from '@/components/client/ClientAppointments';

// Mock fetch calls
global.fetch = jest.fn();

// Mock useSession explicitamente
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock useRouter explicitamente
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(),
}));

describe('Client Flow Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as any).mockReturnValue(mockRouter);
    (global.fetch as any).mockReset();
  });

  describe('Profile Management', () => {
    it('should load and update client profile', async () => {
      const mockProfile = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'ACTIVE',
      };

      (global.fetch as any)
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
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Client')).toBeInTheDocument();
      });

      // Edit profile
      fireEvent.click(screen.getByText('Edit Profile'));
      fireEvent.change(screen.getByDisplayValue('Test Client'), {
        target: { value: 'Updated Name' },
      });
      fireEvent.click(screen.getByText('Save Changes'));

      // Verify update
      await waitFor(() => {
        expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
      });
    });
  });

  // describe('Appointment Booking', () => {
  //   it('should complete booking flow', async () => {
  //     // Este fluxo depende de interações complexas de calendário e select.
  //     // Recomenda-se cobrir este cenário com testes E2E (Cypress/Playwright).
  //   });
  // });

  describe('Appointments Management', () => {
    it('should display and filter appointments', async () => {
      const mockAppointments = [
        {
          id: '1',
          date: '2024-05-20',
          time: '10:00',
          status: 'CONFIRMED',
          service: { name: 'Test Service', duration: 60 },
          staff: { name: 'Test Staff' },
          business: { name: 'Test Business' },
        },
      ];

      (global.fetch as any).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      );

      render(
        <SessionProvider session={null}>
          <ClientAppointments />
        </SessionProvider>
      );

      // Verify appointments loaded
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('Test Service'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Test Staff'))).toBeInTheDocument();
      });

      // Test tabs
      fireEvent.click(screen.getByText('Past'));
      fireEvent.click(screen.getByText('Upcoming'));

      // Verify filtering
      expect(screen.getByText('Test Service')).toBeInTheDocument();
    });
  });
}); 