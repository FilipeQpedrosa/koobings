'use client';

import { useState, useEffect } from 'react';
import { GlobalCustomerHeader } from '@/components/layout/GlobalCustomerHeader';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  type: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
  }>;
  staff: Array<{
    id: string;
    name: string;
  }>;
  rating?: number;
  reviewCount?: number;
}

export default function TestHomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      console.log('🔍 Fetching businesses...');
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/customer/marketplace/businesses');
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setBusinesses(data.data);
        console.log(`✅ Loaded ${data.data.length} businesses successfully`);
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching businesses:', error);
      setError(error instanceof Error ? error.message : 'Failed to load businesses');
    } finally {
      setLoading(false);
      console.log('🔄 Loading finished');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalCustomerHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">A carregar negócios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalCustomerHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 font-medium">Erro: {error}</p>
            <button 
              onClick={fetchBusinesses}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalCustomerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Teste da Homepage - Negócios Disponíveis
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {business.name}
              </h2>
              <p className="text-gray-600 mb-3">{business.address}</p>
              <p className="text-sm text-gray-500 mb-4">
                {business.services.length} serviços • {business.staff.length} staff
              </p>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Serviços:</h3>
                {business.services.slice(0, 3).map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">€{service.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum negócio encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
} 