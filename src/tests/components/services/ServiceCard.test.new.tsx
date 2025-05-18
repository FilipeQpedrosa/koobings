import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ServiceCard from '@/components/services/ServiceCard'
import { Service, ServiceCategory, Staff, StaffRole } from '@prisma/client'
import { act } from 'react-dom/test-utils'

// Mock fetch
global.fetch = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn()
  })
}))

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

describe('ServiceCard', () => {
  const mockCategories: ServiceCategory[] = [
    {
      id: '1',
      name: 'Test Category',
      description: null,
      color: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      createdBy: null,
      lastModifiedBy: null,
      businessId: '1'
    }
  ]

  const mockProviders: Staff[] = [
    {
      id: '1',
      name: 'Test Provider',
      email: 'provider@test.com',
      phone: null,
      password: 'hashed_password',
      role: 'STANDARD' as StaffRole,
      businessId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockService: Service & { category: ServiceCategory | null, providers: Staff[] } = {
    id: '1',
    name: 'Test Service',
    description: 'Test Description',
    duration: 60,
    price: 100,
    businessId: '1',
    categoryId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0],
    providers: [mockProviders[0]]
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset()
  })

  it('renders service information correctly', () => {
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    expect(screen.getByText('Test Service')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('60 min')).toBeInTheDocument()
    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('Test Provider')).toBeInTheDocument()
  })

  it('opens edit dialog when edit button is clicked', async () => {
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const editButton = screen.getByLabelText('Edit service')
    await act(async () => {
      fireEvent.click(editButton)
    })

    expect(screen.getByText('Edit Service')).toBeInTheDocument()
  })

  it('shows delete confirmation and deletes service when confirmed', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({ ok: true })
    )

    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByLabelText('Delete service')
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this service?')
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/business/services/${mockService.id}`,
      expect.objectContaining({ method: 'DELETE' })
    )

    confirmSpy.mockRestore()
  })

  it('does not delete when confirmation is cancelled', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => false)

    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByLabelText('Delete service')
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(global.fetch).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('handles delete error gracefully', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    )

    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByLabelText('Delete service')
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(screen.getByText('Failed to delete service. Please try again.')).toBeInTheDocument()
    confirmSpy.mockRestore()
  })

  it('displays provider list when service has providers', () => {
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    expect(screen.getByText('Available Providers:')).toBeInTheDocument()
    expect(screen.getByText('Test Provider')).toBeInTheDocument()
  })
}) 