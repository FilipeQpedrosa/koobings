import { useMemo } from 'react';
import { Service, ServiceCategory, Staff } from '@prisma/client';
import { ServiceFiltersState } from './useServiceFilters';

type ServiceWithRelations = Service & {
  category: ServiceCategory | null;
  providers: Staff[];
};

export function useFilteredServices(
  services: ServiceWithRelations[],
  filters: ServiceFiltersState
) {
  return useMemo(() => {
    return services.filter((service) => {
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(searchTerm);
        const matchesDescription = service.description?.toLowerCase().includes(searchTerm);
        const matchesCategory = service.category?.name.toLowerCase().includes(searchTerm);
        const matchesProvider = service.providers.some(provider =>
          provider.name.toLowerCase().includes(searchTerm)
        );

        if (!matchesName && !matchesDescription && !matchesCategory && !matchesProvider) {
          return false;
        }
      }

      // Apply price range filter
      const price = Number(service.price);
      if (
        price < filters.priceRange.min ||
        (filters.priceRange.max !== Infinity && price > filters.priceRange.max)
      ) {
        return false;
      }

      // Apply duration filter
      if (filters.duration !== null && service.duration !== filters.duration) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Apply sorting
      switch (filters.sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
  }, [services, filters]);
} 