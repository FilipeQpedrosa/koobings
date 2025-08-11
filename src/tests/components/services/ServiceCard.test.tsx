import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ServiceCard from '@/components/services/ServiceCard'
import { Service, ServiceCategory, Staff, StaffRole } from '@prisma/client'
import { act } from 'react'

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
const mockToast = jest.fn()
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}))

jest.mock('@prisma/client', () => ({
  StaffRole: { STANDARD: 'STANDARD', ADMIN: 'ADMIN' },
  // ...outros mocks se necessário
}));

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
      role: StaffRole.STANDARD,
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
    price: 100.0,
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
    mockToast.mockReset()
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
    expect(screen.getByText((content) => /100/.test(content))).toBeInTheDocument()
    expect(screen.getByText((content) => /60|1h|min/.test(content))).toBeInTheDocument()
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

    const editButton = screen.getByLabelText('Editar serviço')
    await act(async () => {
      fireEvent.click(editButton)
    })

    // Check that the edit form is visible
    expect(screen.getByDisplayValue('Test Service')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
  })

  it('shows delete confirmation and deletes service when confirmed', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByLabelText('Excluir serviço')
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(confirmSpy).toHaveBeenCalledWith('Tem certeza de que deseja excluir este serviço?')
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/business/services/${mockService.id}`,
      expect.objectContaining({
        method: 'DELETE'
      })
    )

    confirmSpy.mockRestore()
  })

  it('does not delete when confirmation is cancelled', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)
    
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByLabelText('Excluir serviço')
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(confirmSpy).toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('handles delete error gracefully', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    )
    
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByLabelText('Excluir serviço')
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(confirmSpy).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting service:', expect.any(Error))
    
    confirmSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  it('displays provider list when service has providers', async () => {
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    expect(screen.getByText('Provedores Disponíveis:')).toBeInTheDocument()
    expect(screen.getByText('Test Provider')).toBeInTheDocument()
  })
}) 