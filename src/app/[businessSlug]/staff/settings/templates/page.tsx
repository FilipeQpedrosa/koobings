"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Edit, Trash2, ArrowLeft, Clock, Settings, Zap, Star, Globe, Building } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SlotTemplate {
  id: string;
  name: string;
  description?: string;
  slotsNeeded: number;
  duration: number;
  category?: string;
  isDefault: boolean;
  isActive: boolean;
  businessId?: string;
  metadata?: {
    color?: string;
    icon?: string;
    popular?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface TemplateFormData {
  name: string;
  description: string;
  slotsNeeded: number;
  category: string;
  metadata: {
    color: string;
    icon: string;
    popular: boolean;
  };
}

const CATEGORIES = [
  'corte',
  'coloração',
  'tratamento',
  'manicure',
  'pedicure',
  'massagem',
  'consulta',
  'retoque',
  'outros'
];

const ICONS = [
  '✂️', '🎨', '💆‍♀️', '💅', '🦶', '🤲', '💬', '🔄', '🌟', '⭐', '💎', '🔥', '💫', '🎯', '🚀'
];

const COLORS = [
  '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export default function SlotTemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState<SlotTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SlotTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    slotsNeeded: 1,
    category: 'outros',
    metadata: {
      color: '#3B82F6',
      icon: '✂️',
      popular: false
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      fetchTemplates();
    }
  }, [mounted, user]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/slot-templates?includeGlobal=true');
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data);
      } else {
        setError(data.error?.message || 'Erro ao carregar templates');
      }
    } catch (err) {
      setError('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.slotsNeeded <= 0) {
      toast({
        title: "Erro",
        description: "Nome e slots necessários são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = editingTemplate ? `/api/slot-templates` : '/api/slot-templates';
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const payload = editingTemplate 
        ? { id: editingTemplate.id, ...formData }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: editingTemplate ? "Template atualizado!" : "Template criado!",
          description: editingTemplate ? "Template atualizado com sucesso" : "Template criado com sucesso"
        });
        
        setShowAddModal(false);
        setEditingTemplate(null);
        setFormData({
          name: '',
          description: '',
          slotsNeeded: 1,
          category: 'outros',
          metadata: {
            color: '#3B82F6',
            icon: '✂️',
            popular: false
          }
        });
        fetchTemplates();
      } else {
        toast({
          title: "Erro",
          description: data.error?.message || 'Erro ao salvar template',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao salvar template",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja deletar este template?')) return;

    try {
      const response = await fetch(`/api/slot-templates?id=${templateId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Template deletado!",
          description: "Template removido com sucesso"
        });
        fetchTemplates();
      } else {
        toast({
          title: "Erro",
          description: data.error?.message || 'Erro ao deletar template',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao deletar template",
        variant: "destructive"
      });
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const category = template.category || 'outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, SlotTemplate[]>);

  if (!mounted || authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/staff/settings/services">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Templates de Slots</h1>
            <p className="text-muted-foreground">Gerencie templates reutilizáveis para criação rápida de serviços</p>
          </div>
        </div>
        
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="space-y-6">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4 capitalize flex items-center gap-2">
              {category}
              <Badge variant="secondary">{categoryTemplates.length}</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: template.metadata?.color || '#3B82F6' }}
                        >
                          {template.metadata?.icon || '✂️'}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.description || 'Sem descrição'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Global
                          </Badge>
                        )}
                        {template.metadata?.popular && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{template.duration}min</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {template.slotsNeeded} slots
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>
                          {template.businessId ? 'Template personalizado' : 'Template padrão'}
                        </span>
                      </div>

                      {!template.isDefault && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTemplate(template);
                              setFormData({
                                name: template.name,
                                description: template.description || '',
                                slotsNeeded: template.slotsNeeded,
                                category: template.category || 'outros',
                                metadata: {
                                  color: template.metadata?.color || '#3B82F6',
                                  icon: template.metadata?.icon || '✂️',
                                  popular: template.metadata?.popular || false
                                }
                              });
                              setShowAddModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Template Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Atualize as informações do template' : 'Crie um novo template de slots reutilizável'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slotsNeeded">Slots Necessários *</Label>
                <Input
                  id="slotsNeeded"
                  type="number"
                  min="1"
                  value={formData.slotsNeeded}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    slotsNeeded: parseInt(e.target.value) || 1 
                  }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Duração: {formData.slotsNeeded * 30} minutos
                </p>
              </div>
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select value={formData.metadata.icon} onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  metadata: { ...prev.metadata, icon: value }
                }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICONS.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        {icon} {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.metadata.color}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, color: e.target.value }
                    }))}
                    className="w-16 h-10"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded border-2 ${
                          formData.metadata.color === color ? 'border-primary' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          metadata: { ...prev.metadata, color }
                        }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formData.metadata.popular}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    metadata: { ...prev.metadata, popular: e.target.checked }
                  }))}
                />
                <Label htmlFor="popular">Template Popular</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingTemplate ? 'Atualizar' : 'Criar'} Template
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
