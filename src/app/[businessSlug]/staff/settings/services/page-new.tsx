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
import { Package, Plus, Edit, Trash2, ArrowLeft, Clock, Euro, Search, Upload, Image as ImageIcon, MapPin, CheckCircle, AlertCircle, Zap, Copy, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAddressValidation, getAddressSuggestions } from '@/lib/googleMaps';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  image?: string;
  createdAt: string;
  slotsNeeded?: number;
  slotConfiguration?: any;
  category?: {
    id: string;
    name: string;
  };
  location?: string;
  maxCapacity?: number;
  address?: string;
  availableDays?: number[];
  startTime?: string;
  endTime?: string;
  minAdvanceHours?: number;
  maxAdvanceDays?: number;
  anyTimeAvailable?: boolean;
}

interface SlotTemplate {
  id: string;
  name: string;
  description?: string;
  slotsNeeded: number;
  duration: number;
  category?: string;
  isDefault: boolean;
  metadata?: {
    color?: string;
    icon?: string;
    popular?: boolean;
  };
}

interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  location?: string;
  maxCapacity?: number;
  address?: string;
  availableDays?: number[];
  startTime?: string;
  endTime?: string;
  minAdvanceHours?: number;
  maxAdvanceDays?: number;
  anyTimeAvailable?: boolean;
  slotsNeeded?: number;
  slotConfiguration?: any;
  templateId?: string;
}

export default function StaffSettingsServicesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { validateAddress } = useAddressValidation();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [templates, setTemplates] = useState<SlotTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [bulkFormData, setBulkFormData] = useState({
    basePrice: 50,
    priceMultiplier: 1,
    categoryId: '',
    location: '',
    address: ''
  });
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    image: '',
    slotsNeeded: 1,
    templateId: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      fetchServices();
      fetchTemplates();
    }
  }, [mounted, user]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.error?.message || 'Erro ao carregar serviços');
      }
    } catch (err) {
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/slot-templates?includeGlobal=true');
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar templates:', err);
    }
  };

  const handleTemplateSelect = (template: SlotTemplate) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description || '',
      duration: template.duration,
      slotsNeeded: template.slotsNeeded,
      templateId: template.id,
      price: calculatePriceFromTemplate(template)
    }));
  };

  const calculatePriceFromTemplate = (template: SlotTemplate) => {
    // Preço base: 25€ por slot
    return template.slotsNeeded * 25;
  };

  const handleBulkCreate = async () => {
    if (selectedTemplates.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um template",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/services/bulk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateIds: selectedTemplates,
          basePrice: bulkFormData.basePrice,
          priceMultiplier: bulkFormData.priceMultiplier,
          categoryId: bulkFormData.categoryId || undefined,
          location: bulkFormData.location || undefined,
          address: bulkFormData.address || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Sucesso!",
          description: `${data.data.totalCreated} serviços criados com sucesso!`
        });
        setShowBulkModal(false);
        setSelectedTemplates([]);
        fetchServices();
      } else {
        toast({
          title: "Erro",
          description: data.error?.message || 'Erro ao criar serviços',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao criar serviços em massa",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.price <= 0) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = editingService ? `/api/business/services/${editingService.id}` : '/api/business/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: editingService ? "Serviço atualizado!" : "Serviço criado!",
          description: editingService ? "Serviço atualizado com sucesso" : "Serviço criado com sucesso"
        });
        
        setShowAddModal(false);
        setEditingService(null);
        setFormData({
          name: '',
          description: '',
          duration: 30,
          price: 0,
          image: '',
          slotsNeeded: 1,
          templateId: ''
        });
        fetchServices();
      } else {
        toast({
          title: "Erro",
          description: data.error?.message || 'Erro ao salvar serviço',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao salvar serviço",
        variant: "destructive"
      });
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTemplates = templates.reduce((acc, template) => {
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
          <Link href="/staff/settings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">Gerencie seus serviços e templates de slots</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowBulkModal(true)} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Criar em Massa
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {service.description || 'Sem descrição'}
                  </CardDescription>
                </div>
                {service.slotConfiguration?.templateId && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Template
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{service.duration}min</span>
                    {service.slotsNeeded && (
                      <Badge variant="outline" className="text-xs">
                        {service.slotsNeeded} slots
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{service.price}€</span>
                  </div>
                </div>
                
                {service.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{service.location}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingService(service);
                      setFormData({
                        name: service.name,
                        description: service.description || '',
                        duration: service.duration,
                        price: service.price,
                        image: service.image || '',
                        location: service.location,
                        maxCapacity: service.maxCapacity,
                        address: service.address,
                        availableDays: service.availableDays,
                        startTime: service.startTime,
                        endTime: service.endTime,
                        minAdvanceHours: service.minAdvanceHours,
                        maxAdvanceDays: service.maxAdvanceDays,
                        anyTimeAvailable: service.anyTimeAvailable,
                        slotsNeeded: service.slotsNeeded,
                        slotConfiguration: service.slotConfiguration,
                        templateId: service.slotConfiguration?.templateId
                      });
                      setShowAddModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar delete
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Service Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              {editingService ? 'Atualize as informações do serviço' : 'Crie um novo serviço usando templates ou configuração manual'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="template">Usar Template</TabsTrigger>
              <TabsTrigger value="manual">Configuração Manual</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4">
              <div className="space-y-4">
                <Label>Templates Disponíveis</Label>
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                  {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 capitalize">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {categoryTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer transition-colors ${
                              formData.templateId === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {template.metadata?.icon && (
                                    <span className="text-lg">{template.metadata.icon}</span>
                                  )}
                                  <div>
                                    <div className="font-medium">{template.name}</div>
                                    {template.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {template.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-xs">
                                    {template.slotsNeeded} slots
                                  </Badge>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {template.duration}min
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
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
                    <Label htmlFor="price">Preço (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      required
                    />
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
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => {
                        const duration = parseInt(e.target.value) || 30;
                        setFormData(prev => ({ 
                          ...prev, 
                          duration,
                          slotsNeeded: Math.ceil(duration / 30)
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slotsNeeded">Slots Necessários</Label>
                    <Input
                      id="slotsNeeded"
                      type="number"
                      value={formData.slotsNeeded || 1}
                      onChange={(e) => {
                        const slotsNeeded = parseInt(e.target.value) || 1;
                        setFormData(prev => ({ 
                          ...prev, 
                          slotsNeeded,
                          duration: slotsNeeded * 30
                        }));
                      }}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingService ? 'Atualizar' : 'Criar'} Serviço
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Bulk Create Modal */}
      <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Serviços em Massa</DialogTitle>
            <DialogDescription>
              Selecione templates para criar múltiplos serviços rapidamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Templates Selecionados ({selectedTemplates.length})</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 capitalize">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {categoryTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                            selectedTemplates.includes(template.id) ? 'bg-primary/10' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => {
                            setSelectedTemplates(prev => 
                              prev.includes(template.id)
                                ? prev.filter(id => id !== template.id)
                                : [...prev, template.id]
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {template.metadata?.icon && (
                              <span className="text-sm">{template.metadata.icon}</span>
                            )}
                            <span className="text-sm">{template.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {template.slotsNeeded} slots
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basePrice">Preço Base (€)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={bulkFormData.basePrice}
                  onChange={(e) => setBulkFormData(prev => ({ 
                    ...prev, 
                    basePrice: parseFloat(e.target.value) || 50 
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="priceMultiplier">Multiplicador de Preço</Label>
                <Input
                  id="priceMultiplier"
                  type="number"
                  step="0.1"
                  value={bulkFormData.priceMultiplier}
                  onChange={(e) => setBulkFormData(prev => ({ 
                    ...prev, 
                    priceMultiplier: parseFloat(e.target.value) || 1 
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={bulkFormData.location}
                  onChange={(e) => setBulkFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={bulkFormData.address}
                  onChange={(e) => setBulkFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowBulkModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBulkCreate} disabled={selectedTemplates.length === 0}>
              Criar {selectedTemplates.length} Serviços
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
