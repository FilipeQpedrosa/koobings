'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Trash2, Save, Camera } from 'lucide-react';
import Image from 'next/image';

interface BusinessBrandingCardProps {
  businessSlug?: string | null;
}

export default function BusinessBrandingCard({ businessSlug }: BusinessBrandingCardProps) {
  const { toast } = useToast();
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businessSlug) {
      fetchBusinessInfo();
    }
  }, [businessSlug]);

  const fetchBusinessInfo = async () => {
    try {
      const response = await fetch('/api/business/info');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.logo) {
          setCurrentLogo(data.data.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas ficheiros de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O ficheiro deve ter menos de 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCurrentLogo(result.data.url);
        await saveLogo(result.data.url);
        toast({
          title: "Sucesso",
          description: "Logo carregado com sucesso!",
        });
      } else {
        throw new Error(result.error?.message || 'Erro ao carregar logo');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar logo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const saveLogo = async (logoUrl: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/business/info', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logo: logoUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar logo');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar logo",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const removeLogo = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/business/info', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logo: null
        }),
      });

      if (response.ok) {
        setCurrentLogo(null);
        toast({
          title: "Sucesso",
          description: "Logo removido com sucesso!",
        });
      } else {
        throw new Error('Erro ao remover logo');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover logo",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Brand da Empresa
        </CardTitle>
        <CardDescription>
          Gere o logo e identidade visual da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Logo Display */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">Logo Atual</Label>
          
          {currentLogo ? (
            <div className="flex items-start space-x-4">
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                <Image
                  src={currentLogo}
                  alt="Business Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-gray-600">
                  Logo carregado com sucesso. Será exibido no portal cliente e comunicações.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeLogo}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Logo
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Sem logo</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            {currentLogo ? 'Alterar Logo' : 'Carregar Logo'}
          </Label>
          
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading || saving}
              className="flex-1"
            />
            <Button
              variant="outline"
              disabled={uploading || saving}
              onClick={() => document.querySelector('input[type="file"]')?.click()}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Ficheiro
                </>
              )}
            </Button>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <span className="text-blue-800">
                <strong>Dicas:</strong> Use imagens em PNG ou JPG com fundo transparente. 
                Tamanho recomendado: 200x200px. Máximo: 5MB.
              </span>
            </AlertDescription>
          </Alert>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Onde aparece o logo:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Portal público de agendamentos</li>
            <li>• Emails automáticos de confirmação</li>
            <li>• Dashboard do staff</li>
            <li>• Relatórios e documentos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 