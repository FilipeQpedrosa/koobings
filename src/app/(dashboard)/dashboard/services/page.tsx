'use client';

import { useState } from 'react';
import { Search, Plus, Clock, DollarSign } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function ServicesPage() {
  const [services] = useState<Service[]>([
    {
      id: 1,
      name: 'Corte de Cabelo',
      description: 'Corte masculino ou feminino',
      duration: 30,
      price: 25.0,
    },
    {
      id: 2,
      name: 'Manicure',
      description: 'Tratamento completo para unhas',
      duration: 45,
      price: 20.0,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Novo Serviço
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Procurar serviços..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 space-y-4"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {service.duration} min
              </div>
              <div className="flex items-center text-gray-900 font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                {service.price.toFixed(2)} €
              </div>
            </div>
            <div className="pt-4 flex justify-end border-t">
              <button className="text-sm text-indigo-600 hover:text-indigo-900">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 