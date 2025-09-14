'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ClientSigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>(''); // Add server error state
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);

  useEffect(() => {
    // Show success message if coming from registration
    if (searchParams?.get('registered') === 'true') {
      setShowRegisteredMessage(true);
      toast({
        title: "Registo concluído!",
        description: "Faça login com as suas credenciais.",
      });
    }
  }, [searchParams, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setServerError(''); // Clear previous server errors
      
      const response = await fetch('/api/auth/client/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Login realizado!",
          description: `Bem-vindo, ${data.user?.name || 'Cliente'}!`,
        });
        
        // 🧹 CLEAR LOGOUT STATE ON SUCCESSFUL LOGIN
        if (typeof window !== 'undefined') {
          console.log('🧹 Clearing logout state after successful login...');
          try {
            const { clearLogoutState } = await import('@/lib/logout-tracker');
            clearLogoutState(data.user?.email);
          } catch (error) {
            console.warn('⚠️ Failed to clear logout state:', error);
          }
        }
        
        // Trigger auth refresh for GlobalCustomerHeader
        console.log('🎉 Login successful, triggering auth refresh...');
        
        // Method 1: Custom event
        const event = new CustomEvent('customer-login-success', { 
          detail: { user: data.user } 
        });
        window.dispatchEvent(event);
        
        // Method 2: LocalStorage event (for cross-tab communication)
        localStorage.setItem('customer-login-success', Date.now().toString());
        localStorage.removeItem('customer-login-success');
        
        // Delay to ensure cookie is set and auth refresh is triggered
        setTimeout(() => {
          // Check if there's a booking flow to continue
          const bookingState = sessionStorage.getItem('bookingState');
          if (bookingState) {
            try {
              const booking = JSON.parse(bookingState);
              console.log('🔄 Continuing booking flow after login:', booking.returnTo);
              sessionStorage.removeItem('bookingState'); // Clean up
              router.push(booking.returnTo);
              return;
            } catch (error) {
              console.error('❌ Error parsing booking state:', error);
            }
          }
          
          console.log('🔄 Redirecting to homepage after login...');
          router.push('/');
        }, 2000); // Increased from 1000ms to 2000ms for better synchronization
      } else {
        // Set server error to display on page
        const errorMessage = data.error?.message || 'Email ou password incorretos';
        setServerError(errorMessage);
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Falha no login. Verifique as suas credenciais.";
      setServerError(errorMessage);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear server error when user starts typing
    if (serverError) {
      setServerError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Back to Home */}
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </Link>
        </div>

        {/* Registration Success Message */}
        {showRegisteredMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Conta criada com sucesso!</h3>
                <p className="text-sm text-green-700">Pode agora fazer login com as suas credenciais.</p>
              </div>
            </div>
          </motion.div>
        )}

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Entrar na Conta
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Aceda ao seu perfil e gerir agendamentos
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite o seu email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                    className={`pl-10 h-12 border-2 focus:ring-blue-400 rounded-lg text-base ${
                      errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite a sua password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                    className={`pl-10 pr-10 h-12 border-2 focus:ring-blue-400 rounded-lg text-base ${
                      errors.password ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Server Error Display */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm font-medium">{serverError}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>A entrar...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  href="/auth/client/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Esqueceu-se da password?
                </Link>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  Não tem conta?{' '}
                  <Link
                    href="/auth/client/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Registe-se aqui
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 max-w-sm mx-auto">
          <p>
            🔒 Ligação segura. Os seus dados estão protegidos.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 