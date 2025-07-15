'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('sporttv@sporttv.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setResult({
        status: response.status,
        data,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Email Availability Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Email to test:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '8px',
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </label>
        <button
          onClick={testEmail}
          disabled={loading}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Email'}
        </button>
      </div>

      {result && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <h3>Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>Test Cases:</h3>
        <button onClick={() => setEmail('sporttv@sporttv.com')}>Test sporttv@sporttv.com</button>
        <br />
        <button onClick={() => setEmail('clube@k.com')} style={{ marginTop: '5px' }}>Test clube@k.com</button>
        <br />
        <button onClick={() => setEmail('test@unique.com')} style={{ marginTop: '5px' }}>Test test@unique.com</button>
      </div>
    </div>
  );
} 