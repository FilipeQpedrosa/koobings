'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function CustomerPortal() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load services. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectService = (serviceId: string) => {
    router.push(`/book/${serviceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick intro */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Service</h1>
        <p className="mt-2 text-gray-600">Select a service to start booking your appointment</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleSelectService(service.id)}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{service.duration} minutes</span>
              </div>
              <div className="mt-2 text-lg font-semibold">
                ${service.price}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2">
                Book Now <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Booking Steps */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Booking Steps:</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center">1</div>
            <span>Choose your service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center">2</div>
            <span>Select date and time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center">3</div>
            <span>Confirm booking</span>
          </div>
        </div>
      </div>
    </div>
  );
} 