'use client';

import { useState, useEffect } from 'react';

export default function ListEmailsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/list-emails');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>📧 Emails em Uso</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>📧 Emails em Uso</h1>
        <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>
          <strong>Erro:</strong> {error}
        </div>
        <button onClick={fetchEmails} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  const { summary, businesses, staff, duplicates } = data;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px' }}>
      <h1>📧 Emails em Uso na Base de Dados</h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📊 Resumo</h3>
        <ul>
          <li><strong>Total de Negócios:</strong> {summary.totalBusinesses}</li>
          <li><strong>Total de Staff:</strong> {summary.totalStaff}</li>
          <li><strong>Total de Emails:</strong> {summary.totalEmails}</li>
          <li><strong>Emails Únicos:</strong> {summary.uniqueEmails}</li>
          <li><strong>Emails Duplicados:</strong> {summary.duplicateEmails}</li>
        </ul>
      </div>

      {duplicates.length > 0 && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <h3>⚠️ Emails Duplicados</h3>
          {duplicates.map((dup: any, index: number) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>{dup.email}</strong>
              <ul>
                {dup.items.map((item: any, i: number) => (
                  <li key={i}>
                    {item.type}: {item.name} (ID: {item.id})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>🏢 Negócios ({businesses.length})</h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {businesses.map((business: any) => (
              <div key={business.id} style={{ 
                marginBottom: '10px', 
                padding: '8px', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                border: '1px solid #e9ecef'
              }}>
                <div><strong>{business.name}</strong></div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  📧 {business.email}<br/>
                  🔗 {business.slug}<br/>
                  📊 {business.status}<br/>
                  📅 {new Date(business.createdAt).toLocaleDateString('pt-PT')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>👤 Staff ({staff.length})</h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {staff.map((member: any) => (
              <div key={member.id} style={{ 
                marginBottom: '10px', 
                padding: '8px', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                border: '1px solid #e9ecef'
              }}>
                <div><strong>{member.name}</strong></div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  📧 {member.email}<br/>
                  👔 {member.role}<br/>
                  🏢 Business ID: {member.businessId}<br/>
                  📅 {new Date(member.createdAt).toLocaleDateString('pt-PT')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Última atualização: {new Date(data.timestamp).toLocaleString('pt-PT')}</p>
        <button onClick={fetchEmails} style={{ padding: '8px 16px', fontSize: '14px' }}>
          🔄 Atualizar
        </button>
      </div>
    </div>
  );
} 