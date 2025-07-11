'use client';

import { useState } from 'react';

export default function TestAppointment() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testAppointment = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/business/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvYW9AbWFyaWEuY29tIiwibmFtZSI6IkpvYW8gTWFyaWEgUmVpcyIsInJvbGUiOiJTVEFGRiIsInN0YWZmUm9sZSI6IlNUQU5EQVJEIiwiYnVzaW5lc3NJZCI6ImNtY3U0ZXMzcTAwMDN3b3A0OWtkZTc2enciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzUyMjMzMzk4LCJleHAiOjE3NTIzMTk3OTh9.ozo35ILP5HV5cEGAtiwdBdQljenZt-Nw_9TAGHvmH3Q'
        },
        credentials: 'include',
        body: JSON.stringify({
          clientId: "4e904d6f-f48b-4391-a6cb-c5c8717d9cfb",
          serviceIds: ["71e7c6fb-75f1-40a1-b43f-d248ae3a7e09"],
          staffId: "939d1e66-fd77-4b07-9e82-5fafd9aba130",
          scheduledFor: "2025-01-19T17:00:00",
          notes: "Teste do frontend"
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(`Erro ${response.status}: ${data.error?.message || 'Erro desconhecido'}`);
      }
    } catch (err) {
      setError(`Erro de rede: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Criação de Appointment</h1>
      
      <button
        onClick={testAppointment}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Criar Appointment'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Sucesso!</strong>
          <pre className="mt-2 text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 