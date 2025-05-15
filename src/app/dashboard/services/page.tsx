'use client';

import { useState } from 'react';
import ServiceModal from '@/components/ServiceModal';
import CategoryModal from '@/components/CategoryModal';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  categoryId: string;
  providers: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Therapy Sessions',
      description: 'Individual therapy sessions',
      color: '#9999FF',
    }
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Individual Therapy Session',
      description: '50-minute individual therapy session',
      duration: 50,
      price: 150.00,
      categoryId: '1',
      providers: ['dr_thompson', 'dr_chen'],
    }
  ]);

  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  // Mock providers data (this would come from your staff management)
  const providers = [
    { id: 'dr_thompson', name: 'Dr. Thompson' },
    { id: 'dr_chen', name: 'Dr. Chen' },
  ];

  const handleSaveService = (serviceData: Omit<Service, 'id'>) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...serviceData, id: service.id }
          : service
      ));
    } else {
      // Create new service
      setServices([
        ...services,
        {
          ...serviceData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ]);
    }
  };

  const handleSaveCategory = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === editingCategory.id 
          ? { ...categoryData, id: category.id }
          : category
      ));
    } else {
      // Create new category
      setCategories([
        ...categories,
        {
          ...categoryData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ]);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if category is in use
    const inUse = services.some(service => service.categoryId === categoryId);
    if (inUse) {
      alert('Cannot delete category that is in use by services');
      return;
    }
    setCategories(categories.filter(category => category.id !== categoryId));
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Service Categories</h2>
          <button
            onClick={() => {
              setEditingCategory(undefined);
              setIsAddingCategory(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
            >
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                  onClick={() => {
                    setEditingCategory(category);
                    setIsAddingCategory(true);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Services</h2>
          <button
            onClick={() => {
              setEditingService(undefined);
              setIsAddingService(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Providers
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {categories.find(c => c.id === service.categoryId)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.duration} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.providers.length} providers
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() => {
                        setEditingService(service);
                        setIsAddingService(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceModal
        isOpen={isAddingService}
        onClose={() => {
          setIsAddingService(false);
          setEditingService(undefined);
        }}
        onSave={handleSaveService}
        categories={categories}
        service={editingService}
        providers={providers}
      />

      <CategoryModal
        isOpen={isAddingCategory}
        onClose={() => {
          setIsAddingCategory(false);
          setEditingCategory(undefined);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
} 