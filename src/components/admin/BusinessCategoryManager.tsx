'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tag, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BusinessCategoryManagerProps {
  businessId: string;
  currentCategory?: string;
  businessName?: string;
}

interface BusinessCategoryInfo {
  business: {
    id: string;
    name: string;
    type: string;
    email: string;
    updatedAt: string;
  };
  availableTypes: string[];
}

const CATEGORY_LABELS: Record<string, { name: string; description: string; color: string }> = {
  'HAIR_SALON': { name: 'Cabeleireiro', description: 'Salões de cabeleireiro e beleza', color: '#8B5CF6' },
  'BARBERSHOP': { name: 'Barbearia', description: 'Barbearias masculinas', color: '#6366F1' },
  'NAIL_SALON': { name: 'Manicure/Pedicure', description: 'Salões de unhas e estética', color: '#EC4899' },
  'PHYSIOTHERAPY': { name: 'Fisioterapia', description: 'Clínicas de fisioterapia', color: '#10B981' },
  'PSYCHOLOGY': { name: 'Psicologia', description: 'Consultas de psicologia', color: '#F59E0B' },
  'OTHER': { name: 'Outro', description: 'Outros tipos de negócio', color: '#6B7280' }
};

export default function BusinessCategoryManager({ 
  businessId, 
  currentCategory, 
  businessName 
}: BusinessCategoryManagerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState<BusinessCategoryInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory || '');
  const [reason, setReason] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (businessId) {
      fetchCategoryInfo();
    }
  }, [businessId]);

  useEffect(() => {
    setHasChanges(selectedCategory !== currentCategory);
  }, [selectedCategory, currentCategory]);

  const fetchCategoryInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/businesses/${businessId}/category`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar informações da categoria');
      }

      const result = await response.json();
      if (result.success) {
        setCategoryInfo(result.data);
        setSelectedCategory(result.data.business.type);
      } else {
        throw new Error(result.message || 'Erro desconhecido');
      }
    } catch (err) {
      toast({
        title: "❌ Erro",
        description: err instanceof Error ? err.message : "Erro ao carregar categoria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) {
      toast({
        title: "❌ Categoria obrigatória",
        description: "Selecione uma categoria para o negócio",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/businesses/${businessId}/category`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedCategory,
          reason: reason || 'Atualização de categoria pelo admin'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "✅ Sucesso",
          description: result.message || "Categoria atualizada com sucesso",
        });
        
        // Update local state
        if (categoryInfo) {
          setCategoryInfo({
            ...categoryInfo,
            business: {
              ...categoryInfo.business,
              type: selectedCategory,
              updatedAt: new Date().toISOString()
            }
          });
        }
        
        setReason('');
        setHasChanges(false);
      } else {
        throw new Error(result.message || 'Erro ao atualizar categoria');
      }
    } catch (err) {
      toast({
        title: "❌ Erro",
        description: err instanceof Error ? err.message : "Erro ao atualizar categoria",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getCurrentCategoryInfo = () => {
    if (!selectedCategory) return null;
    return CATEGORY_LABELS[selectedCategory];
  };

  const currentCategoryInfo = getCurrentCategoryInfo();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Categoria do Negócio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Categoria do Negócio
        </CardTitle>
        <CardDescription>
          Defina a categoria que melhor descreve este negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Category Display */}
        {currentCategoryInfo && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">Categoria Atual</Label>
            <div className="mt-2 flex items-center">
              <Badge 
                variant="secondary" 
                style={{ 
                  backgroundColor: currentCategoryInfo.color + '20', 
                  color: currentCategoryInfo.color 
                }}
                className="mr-3"
              >
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: currentCategoryInfo.color }}
                />
                {currentCategoryInfo.name}
              </Badge>
              <span className="text-sm text-gray-600">
                {currentCategoryInfo.description}
              </span>
            </div>
          </div>
        )}

        {/* Category Selector */}
        <div className="space-y-3">
          <Label htmlFor="category">Nova Categoria</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categoryInfo?.availableTypes.map((type) => {
                const categoryData = CATEGORY_LABELS[type];
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: categoryData?.color || '#6B7280' }}
                      />
                      {categoryData?.name || type}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Reason for Change */}
        {hasChanges && (
          <div className="space-y-3">
            <Label htmlFor="reason">Motivo da Alteração (Opcional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo desta alteração de categoria..."
              rows={3}
            />
          </div>
        )}

        {/* Change Alert */}
        {hasChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A categoria será alterada de <strong>{CATEGORY_LABELS[currentCategory || '']?.name}</strong> para <strong>{currentCategoryInfo?.name}</strong>.
              Esta alteração será registada no histórico do negócio.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          {hasChanges && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory(currentCategory || '');
                setReason('');
              }}
            >
              Cancelar
            </Button>
          )}
          <Button 
            onClick={handleUpdateCategory}
            disabled={!hasChanges || saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Atualizando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Atualizar Categoria
              </>
            )}
          </Button>
        </div>

        {/* Last Update Info */}
        {categoryInfo?.business.updatedAt && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Última atualização: {new Date(categoryInfo.business.updatedAt).toLocaleString('pt-PT')}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 