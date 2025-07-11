'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, Crown } from 'lucide-react';

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side security check
    if (email !== 'f.queirozpedrosa@gmail.com') {
      setError('Apenas administradores autorizados podem aceder ao portal admin.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Admin login attempt with custom auth...');
      
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Admin login successful!');
        console.log('🔄 Redirecting to:', data.redirectUrl);
        console.log('👤 User:', data.user);
        
        // Verify it's actually an admin
        if (data.user.role === 'ADMIN' && data.user.isAdmin) {
          window.location.href = data.redirectUrl;
        } else {
          setError('Acesso negado. Não tem permissões de administrador.');
        }
      } else {
        console.error('❌ Admin login failed:', data.error);
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('🚨 Admin login error:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Crown className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Portal Admin</CardTitle>
          <CardDescription className="text-center">
            Acesso exclusivo para administradores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Administrativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@koobings.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'A verificar...' : 'Aceder como Admin'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => router.push('/auth/signin')}
              className="text-sm text-gray-500"
            >
              ← Voltar ao login normal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 