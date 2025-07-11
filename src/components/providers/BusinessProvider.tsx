'use client';

import { createContext, useContext, ReactNode } from 'react';

interface BusinessContextType {
  id: string;
  name: string;
  slug: string;
  features: Record<string, boolean>;
  plan: string;
  logo?: string | null;
  settings?: any;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

interface BusinessProviderProps {
  children: ReactNode;
  business: BusinessContextType;
}

export function BusinessProvider({ children, business }: BusinessProviderProps) {
  return (
    <BusinessContext.Provider value={business}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}

export function useBusinessFeature(feature: string): boolean {
  const business = useBusiness();
  return business.features[feature] || false;
} 