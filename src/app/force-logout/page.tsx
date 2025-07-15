'use client';

import { useEffect, useState } from 'react';

export default function ForceLogoutPage() {
  const [status, setStatus] = useState('Fazendo logout...');

  useEffect(() => {
    const performLogout = async () => {
      try {
        setStatus('Limpando sessões...');
        
        // Clear all local storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Call force cleanup API
        const response = await fetch('/api/auth/force-cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setStatus('Logout realizado com sucesso! Redirecionando...');
        } else {
          setStatus('Logout realizado (fallback). Redirecionando...');
        }
        
        // Clear cookies manually as backup
        document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'business-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'admin-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Wait a moment then redirect
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 2000);
        
      } catch (error) {
        console.error('Logout error:', error);
        setStatus('Erro no logout, mas redirecionando mesmo assim...');
        
        // Force redirect even if API fails
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 2000);
      }
    };

    performLogout();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        
        <h1 style={{ marginBottom: '20px', color: '#333' }}>🚪 Fazendo Logout Completo</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>{status}</p>
        
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#999' }}>
          <p>Aguarde enquanto limpamos todas as sessões...</p>
          <p>Será redirecionado automaticamente para o login.</p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 