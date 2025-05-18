import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientProfile from '@/app/(protected)/client/profile/page';
import ClientAppointments from '@/app/client/appointments/page';
import BookingDateTime from '@/app/(customer)/book/datetime/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch calls
global.fetch = jest.fn();

describe('Client Flow Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Profile Management', () => {
    it('should load and update client profile', async () => {
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

  describe('Appointment Booking', () => {
    it('should complete booking flow', async () => {
      const mockTimeSlots = [
        { startTime: '10:00', endTime: '11:00', available: true },
        { startTime: '11:00', endTime: '12:00', available: true },
      ];

      (global.fetch as jest.Mock)
        .mockImplementationOnce(() => 
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTimeSlots),
          })
        )
        .mockImplementationOnce(() => 
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '1' }),
          })
        );

      render(
        <SessionProvider session={null}>
          <BookingDateTime />
        </SessionProvider>
      );

      // Select date and time
      const dateButton = screen.getByRole('button', { name: /choose date/i });
      fireEvent.click(dateButton);
      
      const dateCell = screen.getByRole('gridcell', { name: new Date().getDate().toString() });
      fireEvent.click(dateCell);

      const timeSelect = screen.getByRole('combobox');
      fireEvent.click(timeSelect);
      fireEvent.click(screen.getByText('10:00 - 11:00'));

      // Complete booking
      fireEvent.click(screen.getByText('Book Appointment'));

      // Verify redirect
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/book/success');
      });
    });
  });

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

      (global.fetch as jest.Mock).mockImplementationOnce(() => 
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
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByText('Test Staff')).toBeInTheDocument();
      });

      // Test tabs
      fireEvent.click(screen.getByText('Past'));
      fireEvent.click(screen.getByText('Upcoming'));

      // Verify filtering
      expect(screen.getByText('Test Service')).toBeInTheDocument();
    });
  });
}); 