'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite o seu email.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, digite um email válido.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate password reset request
      // In a real app, this would call an API to send reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique a sua caixa de entrada para instruções de recuperação.",
      });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email Enviado!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Enviámos instruções de recuperação para <strong>{email}</strong>. 
                Verifique a sua caixa de entrada e siga as instruções.
              </p>
              
              <div className="space-y-4">
                <Link href="/auth/client/signin">
                  <Button className="w-full">
                    Voltar ao Login
                  </Button>
                </Link>
                
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Enviar para outro email
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Back to Login */}
        <div className="flex items-center justify-center">
          <Link
            href="/auth/client/signin"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao login</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Recuperar Password
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Digite o seu email para receber instruções de recuperação
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg text-base"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>A enviar...</span>
                  </div>
                ) : (
                  'Enviar Instruções'
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  Lembrou-se da password?{' '}
                  <Link
                    href="/auth/client/signin"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Notice */}
        <div className="text-center text-xs text-gray-500 max-w-sm mx-auto">
          <p>
            💡 Não recebeu o email? Verifique a pasta de spam ou contacte o suporte.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 