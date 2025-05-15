import { render, screen, fireEvent } from '@testing-library/react'
import { ServiceFilters } from '@/components/services/service-filters'
import { ServiceFiltersState } from '@/hooks/useServiceFilters'

describe('ServiceFilters', () => {
  const mockOnFiltersChange = jest.fn()
  const initialFilters: ServiceFiltersState = {
    search: '',
    sort: 'name',
    priceRange: {
      min: 0,
      max: Infinity,
    },
    duration: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all filter components', () => {
    render(
      <ServiceFilters
        onFiltersChange={mockOnFiltersChange}
        initialFilters={initialFilters}
        disabled={false}
      />
    )

    expect(screen.getByPlaceholderText('Search services...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sort by/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument()
  })

  it('updates search filter on input change', () => {
    render(
      <ServiceFilters
        onFiltersChange={mockOnFiltersChange}
        initialFilters={initialFilters}
        disabled={false}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search services...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      search: 'test'
    }))
  })

  it('updates sort filter on selection', () => {
    render(
      <ServiceFilters
        onFiltersChange={mockOnFiltersChange}
        initialFilters={initialFilters}
        disabled={false}
      />
    )

    const sortButton = screen.getByRole('button', { name: /sort by/i })
    fireEvent.click(sortButton)
    
    const priceAscOption = screen.getByText('Price: Low to High')
    fireEvent.click(priceAscOption)

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      sort: 'price-asc'
    }))
  })

  it('shows filter badges when filters are active', () => {
    const activeFilters: ServiceFiltersState = {
      search: 'test',
      sort: 'name',
      priceRange: {
        min: 10,
        max: 100,
      },
      duration: 60,
    }

    render(
      <ServiceFilters
        onFiltersChange={mockOnFiltersChange}
        initialFilters={activeFilters}
        disabled={false}
      />
    )

    expect(screen.getByText('Search: test')).toBeInTheDocument()
    expect(screen.getByText('Price: $10 - $100')).toBeInTheDocument()
    expect(screen.getByText('Duration: 60 minutes')).toBeInTheDocument()
  })

  it('disables all inputs when disabled prop is true', () => {
    render(
      <ServiceFilters
        onFiltersChange={mockOnFiltersChange}
        initialFilters={initialFilters}
        disabled={true}
      />
    )

    expect(screen.getByPlaceholderText('Search services...')).toBeDisabled()
    expect(screen.getByRole('button', { name: /sort by/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /filter/i })).toBeDisabled()
  })
}) 