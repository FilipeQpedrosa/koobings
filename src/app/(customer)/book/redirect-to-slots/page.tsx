'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RedirectToSlotsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get current URL parameters
    const businessSlug = searchParams.get('businessSlug');
    const serviceId = searchParams.get('serviceId');
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');

    // Build new URL with same parameters
    const params = new URLSearchParams();
    if (businessSlug) params.append('businessSlug', businessSlug);
    if (serviceId) params.append('serviceId', serviceId);
    if (staffId) params.append('staffId', staffId);
    if (date) params.append('date', date);

    // Redirect to new slots page
    const newUrl = `/book/slots?${params.toString()}`;
    console.log('🔄 [REDIRECT] Redirecting to slots page:', newUrl);
    
    router.replace(newUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Redirecionando para o sistema de slots...
        </h2>
        <p className="text-gray-600">
          Aguarde enquanto carregamos a nova interface de agendamento
        </p>
      </div>
    </div>
  );
}
