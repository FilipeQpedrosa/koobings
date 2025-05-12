'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingData {
  businessHours: {
    day: number;
    isOpen: boolean;
    start: string;
    end: string;
  }[];
  services: {
    name: string;
    description: string;
    duration: number;
    price: number;
  }[];
  staff: {
    name: string;
    email: string;
    role: string;
  }[];
}

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    businessHours: [
      { day: 1, isOpen: true, start: '09:00', end: '18:00' },
      { day: 2, isOpen: true, start: '09:00', end: '18:00' },
      { day: 3, isOpen: true, start: '09:00', end: '18:00' },
      { day: 4, isOpen: true, start: '09:00', end: '18:00' },
      { day: 5, isOpen: true, start: '09:00', end: '18:00' },
      { day: 6, isOpen: true, start: '09:00', end: '14:00' },
      { day: 0, isOpen: false, start: '09:00', end: '18:00' },
    ],
    services: [],
    staff: [],
  });
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save business hours
      await fetch('/api/business/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: data.businessHours }),
      });

      // Save services
      await fetch('/api/business/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: data.services }),
      });

      // Save staff
      await fetch('/api/business/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff: data.staff }),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setStep(1)}
              className={`px-4 py-2 rounded-md ${
                step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100'
              }`}
            >
              1. Horários
            </button>
            <button
              onClick={() => setStep(2)}
              className={`px-4 py-2 rounded-md ${
                step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100'
              }`}
            >
              2. Serviços
            </button>
            <button
              onClick={() => setStep(3)}
              className={`px-4 py-2 rounded-md ${
                step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100'
              }`}
            >
              3. Equipe
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Horários de Funcionamento</h2>
            {data.businessHours.map((hours) => (
              <div key={hours.day} className="flex items-center space-x-4 mb-4">
                <div className="w-32">
                  {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][hours.day]}
                </div>
                <input
                  type="checkbox"
                  checked={hours.isOpen}
                  onChange={(e) => {
                    const newHours = [...data.businessHours];
                    newHours[hours.day] = { ...hours, isOpen: e.target.checked };
                    setData({ ...data, businessHours: newHours });
                  }}
                />
                <input
                  type="time"
                  value={hours.start}
                  onChange={(e) => {
                    const newHours = [...data.businessHours];
                    newHours[hours.day] = { ...hours, start: e.target.value };
                    setData({ ...data, businessHours: newHours });
                  }}
                  disabled={!hours.isOpen}
                  className="border rounded-md p-2"
                />
                <input
                  type="time"
                  value={hours.end}
                  onChange={(e) => {
                    const newHours = [...data.businessHours];
                    newHours[hours.day] = { ...hours, end: e.target.value };
                    setData({ ...data, businessHours: newHours });
                  }}
                  disabled={!hours.isOpen}
                  className="border rounded-md p-2"
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Serviços</h2>
            <button
              onClick={() =>
                setData({
                  ...data,
                  services: [
                    ...data.services,
                    { name: '', description: '', duration: 30, price: 0 },
                  ],
                })
              }
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Adicionar Serviço
            </button>
            {data.services.map((service, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index] = { ...service, name: e.target.value };
                        setData({ ...data, services: newServices });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index] = { ...service, description: e.target.value };
                        setData({ ...data, services: newServices });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duração (minutos)
                    </label>
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index] = {
                          ...service,
                          duration: parseInt(e.target.value),
                        };
                        setData({ ...data, services: newServices });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preço</label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index] = {
                          ...service,
                          price: parseFloat(e.target.value),
                        };
                        setData({ ...data, services: newServices });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Equipe</h2>
            <button
              onClick={() =>
                setData({
                  ...data,
                  staff: [...data.staff, { name: '', email: '', role: 'PROVIDER' }],
                })
              }
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Adicionar Membro
            </button>
            {data.staff.map((member, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newStaff = [...data.staff];
                        newStaff[index] = { ...member, name: e.target.value };
                        setData({ ...data, staff: newStaff });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => {
                        const newStaff = [...data.staff];
                        newStaff[index] = { ...member, email: e.target.value };
                        setData({ ...data, staff: newStaff });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Função</label>
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const newStaff = [...data.staff];
                        newStaff[index] = { ...member, role: e.target.value };
                        setData({ ...data, staff: newStaff });
                      }}
                      className="mt-1 block w-full border rounded-md p-2"
                    >
                      <option value="ADMIN">Administrador</option>
                      <option value="PROVIDER">Prestador</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            {step === 3 ? 'Concluir' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
} 