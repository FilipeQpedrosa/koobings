'use client';

import { useState, useEffect } from 'react';
import { GlobalCustomerHeader } from '@/components/layout/GlobalCustomerHeader';
import Link from 'next/link';

export default function TestFinalPage() {
  const [status, setStatus] = useState('checking...');
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    checkEverything();
  }, []);

  const checkEverything = async () => {
    try {
      // Test customer auth
      const profileResponse = await fetch('/api/customer/profile', {
        credentials: 'include'
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setCustomer(profileData.data);
          setStatus('✅ Customer logged in successfully!');
        } else {
          setStatus('❌ Customer not logged in');
        }
      } else {
        setStatus('❌ Customer not authenticated');
      }
    } catch (error) {
      setStatus('❌ Error checking auth: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalCustomerHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🧪 TESTE FINAL - Customer Navigation
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
          <p className="text-lg mb-4">Status: {status}</p>
          
          {customer && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Customer Info:</h3>
              <p>Name: {customer.name}</p>
              <p>Email: {customer.email}</p>
              <p>ID: {customer.id}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">🏠 Navigation Test</h3>
            <div className="space-y-3">
              <Link href="/" className="block p-3 bg-blue-100 rounded hover:bg-blue-200">
                → Homepage
              </Link>
              <Link href="/mari-nails" className="block p-3 bg-purple-100 rounded hover:bg-purple-200">
                → Mari Nails Business
              </Link>
              <Link href="/book?businessSlug=mari-nails" className="block p-3 bg-green-100 rounded hover:bg-green-200">
                → Start Booking Flow
              </Link>
              <Link href="/customer/profile" className="block p-3 bg-yellow-100 rounded hover:bg-yellow-200">
                → Customer Profile
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">🔥 Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={checkEverything}
                className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🔄 Refresh Auth Status
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full p-3 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                🔄 Force Page Reload
              </button>

              <Link 
                href="/auth/client/signin"
                className="block w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 text-center"
              >
                🔑 Go to Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🧪 Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700">
            <li>Se não estás logado: clica "Go to Login" e faz login</li>
            <li>Depois do login, volta a esta página</li>
            <li>Ve se o header mostra "Olá, [nome]!" no topo</li>
            <li>Testa navegar para Mari Nails</li>
            <li>Ve se o header se mantém em todas as páginas</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 