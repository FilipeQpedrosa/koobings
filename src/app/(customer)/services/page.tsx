'use client';

import { useEffect, useState } from 'react';
import { Service, ServiceCategory, Staff } from '@prisma/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type ServiceWithRelations = Service & {
  category: ServiceCategory | null;
  providers: Staff[];
};

export default function ServicesPage() {
  const [services, setServices] = useState<Record<string, ServiceWithRelations[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/client/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        // Handle both array and object responses
        setServices(Array.isArray(data) ? {} : data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // If no services available
  if (Object.keys(services).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-600 mb-4">No services are currently available.</p>
          <p className="text-gray-600">Please check back later or contact us for more information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      
      {Object.entries(services).map(([category, categoryServices]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  {/* Add service image here when available */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm">Service Image</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">${Number(service.price).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{service.duration} minutes</p>
                    </div>
                    <Link href={`/book?serviceId=${service.id}`}>
                      <Button>Book Now</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 