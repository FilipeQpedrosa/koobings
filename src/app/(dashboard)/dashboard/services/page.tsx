'use client';

import { useState, useEffect } from 'react';
import { Service, ServiceCategory, Staff } from '@prisma/client';
import { ServiceFilters } from '@/components/services/service-filters';
import ServiceList from '@/components/services/ServiceList';
import { useFilteredServices } from '@/hooks/useFilteredServices';
import { ServiceFiltersState } from '@/hooks/useServiceFilters';
import CreateServiceButton from '@/components/services/CreateServiceButton';
import { useToast } from '@/components/ui/use-toast';

type ServiceWithRelations = Service & {
  category: ServiceCategory | null;
  providers: Staff[];
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceWithRelations[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useState<ServiceFiltersState>({
    search: '',
    sort: 'name',
    priceRange: {
      min: 0,
      max: Infinity,
    },
    duration: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch services
        const searchParams = new URLSearchParams({
          search: filters.search,
          sort: filters.sort,
          minPrice: filters.priceRange.min.toString(),
          maxPrice: filters.priceRange.max.toString(),
          ...(filters.duration && { duration: filters.duration.toString() }),
        });

        const [servicesRes, categoriesRes, providersRes] = await Promise.all([
          fetch(`/api/services?${searchParams}`),
          fetch('/api/categories'),
          fetch('/api/providers')
        ]);

        if (!servicesRes.ok) throw new Error('Failed to fetch services');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!providersRes.ok) throw new Error('Failed to fetch providers');
        
        const [servicesData, categoriesData, providersData] = await Promise.all([
          servicesRes.json(),
          categoriesRes.json(),
          providersRes.json()
        ]);

        setServices(servicesData);
        setCategories(categoriesData);
        setProviders(providersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, toast]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Services</h1>
        <CreateServiceButton />
      </div>

      <ServiceFilters
        onFiltersChange={setFilters}
        initialFilters={filters}
        disabled={isLoading}
      />

      <ServiceList 
        services={services}
        categories={categories}
        providers={providers}
        isLoading={isLoading}
      />
    </div>
  );
} 