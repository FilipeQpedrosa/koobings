'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestUploadPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [generalUrl, setGeneralUrl] = useState<string | null>(null);

  const handleSave = () => {
    console.log('Saved URLs:', {
      logo: logoUrl,
      avatar: avatarUrl,
      general: generalUrl
    });
    
    // Aqui pode guardar os URLs na base de dados
    alert('Ficheiros guardados com sucesso!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sistema de Upload de Ficheiros</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Logotipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                uploadType="logo"
                placeholder="Upload do Logotipo"
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </CardContent>
          </Card>

          {/* Avatar Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                uploadType="avatar"
                placeholder="Upload da Foto"
                maxSize={2 * 1024 * 1024} // 2MB
              />
            </CardContent>
          </Card>

          {/* General Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Ficheiro Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={generalUrl}
                onChange={setGeneralUrl}
                uploadType="general"
                placeholder="Upload de Imagem"
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>URLs dos Ficheiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Logo:</strong> {logoUrl || 'Nenhum ficheiro'}
                </div>
                <div>
                  <strong>Avatar:</strong> {avatarUrl || 'Nenhum ficheiro'}
                </div>
                <div>
                  <strong>Geral:</strong> {generalUrl || 'Nenhum ficheiro'}
                </div>
              </div>
              
              <Button 
                onClick={handleSave}
                className="mt-6 w-full"
                disabled={!logoUrl && !avatarUrl && !generalUrl}
              >
                Guardar Ficheiros
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Como Usar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Arraste e largue ficheiros ou clique para selecionar</li>
                <li>Suporta JPG, PNG, WebP, GIF</li>
                <li>Limite de tamanho configurável por tipo</li>
                <li>Preview automático das imagens</li>
                <li>URLs são gerados automaticamente</li>
                <li>Ficheiros são organizados por tipo em pastas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 