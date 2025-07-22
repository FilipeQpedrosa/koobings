'use client';

import { useState } from 'react';
import { emailTemplates } from '@/lib/email-templates';

// Sample data for previews
const sampleData = {
  clientName: 'João Silva',
  serviceName: 'Corte de Cabelo',
  staffName: 'Maria Santos',
  businessName: 'Salão Beleza Total',
  date: new Date('2024-01-20T10:30:00'),
  time: '10:30',
  duration: 60,
  businessPhone: '+351 912 345 678',
  notes: 'Cliente prefere corte mais curto nas laterais'
};

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('appointmentConfirmation');

  const templates = {
    appointmentConfirmation: {
      name: '✅ Confirmação de Agendamento',
      template: emailTemplates.appointmentConfirmation(sampleData)
    },
    appointmentReminder: {
      name: '⏰ Lembrete de Agendamento',
      template: emailTemplates.appointmentReminder(sampleData)
    },
    appointmentRejected: {
      name: '❌ Agendamento Rejeitado',
      template: emailTemplates.appointmentRejected({ 
        ...sampleData, 
        reason: 'Horário já ocupado por outro cliente' 
      })
    },
    appointmentCompleted: {
      name: '🏆 Serviço Concluído',
      template: emailTemplates.appointmentCompleted({ 
        ...sampleData, 
        rating: true 
      })
    },
    newAppointmentNotification: {
      name: '🔔 Novo Agendamento (Para Negócio)',
      template: emailTemplates.newAppointmentNotification(sampleData)
    }
  };

  const currentTemplate = templates[selectedTemplate as keyof typeof templates];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Prévia de Templates de Email
          </h1>
          <p className="text-gray-600">
            Visualize como ficam os emails enviados aos clientes e negócios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Template Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Escolher Template:</h3>
              <div className="space-y-2">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      selectedTemplate === key
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>

              {/* Sample Data Info */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">📋 Dados de Exemplo:</h4>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div><strong>Cliente:</strong> {sampleData.clientName}</div>
                  <div><strong>Serviço:</strong> {sampleData.serviceName}</div>
                  <div><strong>Staff:</strong> {sampleData.staffName}</div>
                  <div><strong>Negócio:</strong> {sampleData.businessName}</div>
                  <div><strong>Data:</strong> {sampleData.date.toLocaleDateString('pt-PT')}</div>
                  <div><strong>Hora:</strong> {sampleData.time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Email Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              
              {/* Email Header Info */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentTemplate.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Assunto:</strong> {currentTemplate.template.subject}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(currentTemplate.template.html)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      📋 Copiar HTML
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Preview */}
              <div className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={currentTemplate.template.html}
                    className="w-full h-[600px] border-0"
                    title="Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>

              {/* Raw HTML View (collapsible) */}
              <details className="px-6 pb-6">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 mb-3">
                  👀 Ver HTML Bruto
                </summary>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs font-mono max-h-60">
                  <pre>{currentTemplate.template.html}</pre>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">🧪 Testar Email Real:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Email de Contacto</h4>
              <p className="text-sm text-blue-700 mb-3">
                Sistema já funcional. Usa o formulário de contacto no site.
              </p>
              <a 
                href="/contact" 
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Ir para Contacto
              </a>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">API de Teste</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Use <code>/api/test-email</code> como admin para testar templates.
              </p>
              <button 
                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                onClick={() => alert('Faça login como admin e use a API /api/test-email')}
              >
                Instruções
              </button>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Integração</h4>
              <p className="text-sm text-green-700 mb-3">
                Templates prontos para integrar com agendamentos.
              </p>
              <button 
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                disabled
              >
                Em Breve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 