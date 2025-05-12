'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface BusinessHours {
  day: number;
  isOpen: boolean;
  start: string;
  end: string;
}

export default function SettingsPage() {
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: 1, isOpen: true, start: '09:00', end: '18:00' },
    { day: 2, isOpen: true, start: '09:00', end: '18:00' },
    { day: 3, isOpen: true, start: '09:00', end: '18:00' },
    { day: 4, isOpen: true, start: '09:00', end: '18:00' },
    { day: 5, isOpen: true, start: '09:00', end: '18:00' },
    { day: 6, isOpen: true, start: '09:00', end: '14:00' },
    { day: 0, isOpen: false, start: '09:00', end: '18:00' },
  ]);

  const dayNames = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const handleHoursChange = (
    day: number,
    field: keyof BusinessHours,
    value: string | boolean
  ) => {
    setBusinessHours((prev) =>
      prev.map((hours) =>
        hours.day === day ? { ...hours, [field]: value } : hours
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Informações do Negócio
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do Negócio
              </label>
              <input
                type="text"
                id="businessName"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Horário de Funcionamento
          </h2>
          <div className="space-y-4">
            {businessHours
              .sort((a, b) => (a.day === 0 ? 6 : a.day - 1) - (b.day === 0 ? 6 : b.day - 1))
              .map((hours) => (
                <div
                  key={hours.day}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-3">
                    <span className="text-sm font-medium text-gray-900">
                      {dayNames[hours.day]}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) =>
                          handleHoursChange(hours.day, 'isOpen', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={hours.start}
                      onChange={(e) =>
                        handleHoursChange(hours.day, 'start', e.target.value)
                      }
                      disabled={!hours.isOpen}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={hours.end}
                      onChange={(e) =>
                        handleHoursChange(hours.day, 'end', e.target.value)
                      }
                      disabled={!hours.isOpen}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 