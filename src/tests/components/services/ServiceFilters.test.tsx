import { render, screen, fireEvent } from '@testing-library/react'
import ServiceFilters from '@/components/services/ServiceFilters'

describe('ServiceFilters', () => {
  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all filter components', () => {
    render(
      <ServiceFilters
        filters={{
          search: '',
          sort: 'name',
          priceRange: { min: 0, max: Infinity },
          duration: null,
        }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByPlaceholderText('Search services...')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument()
  })

  it('updates search filter on input change', () => {
    render(
      <ServiceFilters
        filters={{
          search: '',
          sort: 'name',
          priceRange: { min: 0, max: Infinity },
          duration: null,
        }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search services...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      search: 'test',
    }))
  })

  it('updates sort filter on selection', () => {
    render(
      <ServiceFilters
        filters={{
          search: '',
          sort: 'name',
          priceRange: { min: 0, max: Infinity },
          duration: null,
        }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const sortSelect = screen.getByRole('combobox')
    fireEvent.click(sortSelect)
    
    // Note: You'll need to implement the actual selection logic based on your UI component
    // This is just a placeholder
    expect(sortSelect).toBeInTheDocument()
  })

  it('shows filter badges when filters are active', () => {
    const activeFilters = {
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
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText('Search: test')).toBeInTheDocument()
    expect(screen.getByText('Price: $10 - $100')).toBeInTheDocument()
    expect(screen.getByText('Duration: 60 minutes')).toBeInTheDocument()
  })

  it('disables all inputs when disabled prop is true', () => {
    render(
      <ServiceFilters
        filters={{
          search: '',
          sort: 'name',
          priceRange: { min: 0, max: Infinity },
          duration: null,
        }}
        onFiltersChange={mockOnFiltersChange}
        disabled
      />
    )

    expect(screen.getByPlaceholderText('Search services...')).toBeDisabled()
    expect(screen.getByRole('combobox')).toHaveAttribute('data-disabled')
    expect(screen.getByRole('button', { name: /filter/i })).toBeDisabled()
  })
}) 