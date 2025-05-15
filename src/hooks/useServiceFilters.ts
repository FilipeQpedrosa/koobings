import { useState } from 'react';
import { useDebounce } from './useDebounce';

export interface ServiceFiltersState {
  search: string;
  sort: 'name' | 'price-asc' | 'price-desc' | 'duration';
  priceRange: {
    min: number;
    max: number;
  };
  duration: number | null;
}

export function useServiceFilters(initialState?: Partial<ServiceFiltersState>) {
  const [filters, setFilters] = useState<ServiceFiltersState>({
    search: '',
    sort: 'name',
    priceRange: {
      min: 0,
      max: Infinity,
    },
    duration: null,
    ...initialState,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const updateSort = (sort: ServiceFiltersState['sort']) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const updatePriceRange = (priceRange: ServiceFiltersState['priceRange']) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  };

  const updateDuration = (duration: ServiceFiltersState['duration']) => {
    setFilters((prev) => ({ ...prev, duration }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      sort: 'name',
      priceRange: {
        min: 0,
        max: Infinity,
      },
      duration: null,
    });
  };

  return {
    filters,
    debouncedSearch,
    updateSearch,
    updateSort,
    updatePriceRange,
    updateDuration,
    resetFilters,
  };
} 