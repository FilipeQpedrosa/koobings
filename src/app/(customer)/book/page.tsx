'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Service, ServiceCategory, Staff } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ServiceWithRelations = Service & {
  category: ServiceCategory | null;
  providers: Staff[];
};

export default function BookServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Record<string, ServiceWithRelations[]>>({});
  const [selectedService, setSelectedService] = useState<string | null>(searchParams.get('serviceId'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/client/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
        
        // Initialize expanded state for categories
        const initialExpandedState = Object.keys(data).reduce((acc, category) => {
          // If there's a selected service, expand its category
          const shouldExpand = data[category].some((service: ServiceWithRelations) => service.id === selectedService);
          acc[category] = shouldExpand;
          return acc;
        }, {} as Record<string, boolean>);
        setExpandedCategories(initialExpandedState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [selectedService]);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      router.push(`/book/info?serviceId=${selectedService}`);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Select a Service</h1>
        <p className="text-gray-600">Choose the service you'd like to book</p>
      </div>

      <div className="space-y-4">
        {Object.entries(services).map(([category, categoryServices]) => (
          <div key={category} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-xl font-semibold">{category}</h2>
              {expandedCategories[category] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedCategories[category] && (
              <div className="p-4 space-y-4">
                {categoryServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'ring-2 ring-primary'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{service.duration} minutes</span>
                          <span>${Number(service.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300">
                        {selectedService === service.id && (
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleContinue}
          disabled={!selectedService}
          className="w-full sm:w-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 