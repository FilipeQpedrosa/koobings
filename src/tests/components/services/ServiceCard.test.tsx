import { render, screen, fireEvent } from '@testing-library/react'
import ServiceCard from '@/components/services/ServiceCard'
import { Service, ServiceCategory, Staff } from '@prisma/client'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn()
  })
}))

describe('ServiceCard', () => {
  const mockService: Service & {
    category: ServiceCategory | null
    providers: Staff[]
  } = {
    id: '1',
    name: 'Test Service',
    description: 'Test Description',
    duration: 60,
    price: '100' as any, // Mock Decimal as string for testing
    businessId: '1',
    categoryId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: '1',
      name: 'Test Category',
      description: null,
      color: null,
      businessId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    providers: [
      {
        id: '1',
        name: 'Test Provider',
        email: 'test@example.com',
        role: 'PROVIDER',
        password: 'hashed',
        businessId: '1',
        lastActive: null,
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  const mockCategories: ServiceCategory[] = [
    {
      id: '1',
      name: 'Test Category',
      description: null,
      color: null,
      businessId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockProviders: Staff[] = [
    {
      id: '1',
      name: 'Test Provider',
      email: 'test@example.com',
      role: 'PROVIDER',
      password: 'hashed',
      businessId: '1',
      lastActive: null,
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

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

  it('opens edit dialog when edit button is clicked', () => {
    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(screen.getByText('Edit Service')).toBeInTheDocument()
  })

  it('shows delete confirmation when delete button is clicked', () => {
    const confirmSpy = jest.spyOn(window, 'confirm')
    confirmSpy.mockImplementation(() => true)

    render(
      <ServiceCard
        service={mockService}
        categories={mockCategories}
        providers={mockProviders}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this service?')
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