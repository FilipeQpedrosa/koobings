'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Service, ServiceCategory } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatDuration } from '@/lib/utils';

type ServiceWithCategory = Service & {
  category: ServiceCategory | null;
};

interface GroupedServices {
  [key: string]: ServiceWithCategory[];
}

export default function ServiceSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<GroupedServices>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services/available');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
        
        // Initialize expanded state
        const initialExpandedState = Object.keys(data).reduce((acc, category) => {
          acc[category] = true; // Start with all categories expanded
          return acc;
        }, {} as Record<string, boolean>);
        setExpandedCategories(initialExpandedState);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load services. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [toast]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredServices = Object.entries(services).reduce((acc, [category, categoryServices]) => {
    const filtered = categoryServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as GroupedServices);

  const handleContinue = () => {
    if (!selectedService) return;
    
    // Store selection in session storage
    sessionStorage.setItem('selectedService', selectedService);
    
    // Navigate to next step
    router.push(`/book/datetime?serviceId=${selectedService}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/4" />
            <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your Service</h1>
        <p className="text-gray-600">Select the service you'd like to book</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {Object.entries(filteredServices).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No services found matching your search.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {Object.entries(filteredServices).map(([category, categoryServices]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <h2 className="text-lg font-semibold">{category}</h2>
                  {expandedCategories[category] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCategories[category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {categoryServices.map((service) => (
                          <Card
                            key={service.id}
                            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                              selectedService === service.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedService(service.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <h3 className="font-medium">{service.name}</h3>
                                {service.description && (
                                  <p className="text-sm text-gray-600">{service.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{formatDuration(service.duration)}</span>
                                  <span>{formatPrice(Number(service.price))}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0">
                                {selectedService === service.id && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-6">
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