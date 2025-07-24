"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Plus, Edit, Trash2, ArrowLeft, Clock, Euro, Search, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  image?: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
}

interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
}

export default function StaffSettingsServicesPage() {
  // 🔥 ALL HOOKS AT THE TOP - NEVER CONDITIONAL
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // 🔥 HYDRATION SAFETY - Wait for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && user?.businessSlug) {
      fetchServices();
    }
  }, [mounted, authLoading, user?.businessSlug]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔧 DEBUG: Fetching services...');
      
      // Add timestamp to prevent cache
      const timestamp = Date.now();
      const response = await fetch(`/api/business/services?t=${timestamp}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('🔧 DEBUG: Fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔧 DEBUG: Fetch response data:', data);
        
        if (data.success) {
          console.log('🔧 DEBUG: Setting services to:', data.data.length, 'items');
          console.log('🔧 DEBUG: Services list:', data.data.map((s: any) => ({ 
            id: s.id, 
            name: s.name, 
            createdAt: s.createdAt 
          })));
          setServices(data.data);
        } else {
          setError(data.error || 'Failed to load services');
        }
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      console.error('🔧 DEBUG: Error fetching services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'general');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData(prev => ({
          ...prev,
          image: result.data.url
        }));
        toast({
          title: "Sucesso",
          description: "Imagem carregada com sucesso!",
        });
      } else {
        throw new Error(result.error?.message || 'Erro ao carregar imagem');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar imagem",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: 0,
      image: ''
    });
    setShowAddModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      image: service.image || ''
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔧 DEBUG: handleSubmit called');
    console.log('🔧 DEBUG: formData:', formData);
    
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const url = editingService 
        ? `/api/business/services/${editingService.id}`
        : '/api/business/services';
      
      const method = editingService ? 'PUT' : 'POST';
      
      console.log('🔧 DEBUG: Making request to:', url);
      console.log('🔧 DEBUG: Method:', method);
      console.log('🔧 DEBUG: Body:', {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        duration: formData.duration,
        price: formData.price,
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          duration: formData.duration,
          price: formData.price,
          image: formData.image || undefined,
        }),
      });

      console.log('🔧 DEBUG: Response status:', response.status);
      console.log('🔧 DEBUG: Response headers:', response.headers);
      
      const data = await response.json();
      console.log('🔧 DEBUG: Response data:', data);
      
      if (data.success) {
        console.log('🔧 DEBUG: Service created successfully, refreshing list');
        console.log('🔧 DEBUG: Current services before refresh:', services.length);
        
        // Force refresh the services list
        setLoading(true);
        await fetchServices();
        
        console.log('🔧 DEBUG: Services refreshed');
        closeModal();
      } else {
        console.log('🔧 DEBUG: Service creation failed:', data.error);
        setError(data.error || `Failed to ${editingService ? 'update' : 'create'} service`);
      }
    } catch (error) {
      console.error('🔧 DEBUG: Error saving service:', error);
      setError(`Failed to ${editingService ? 'update' : 'create'} service`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`/api/business/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchServices(); // Refresh the list
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔥 CRITICAL: Prevent rendering until mounted (hydration safety)
  if (!mounted) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user?.businessSlug) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Business Information Missing</h3>
          <p className="text-red-600">Unable to load services settings. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/${user.businessSlug}/staff/settings`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-1">Manage your business services and pricing</p>
          </div>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.length > 0 
                ? Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)
                : 0}min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{services.length > 0 
                ? (services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(0)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
              {error}
            </div>
          )}

          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try a different search term.' : 'Get started by adding your first service.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button onClick={openAddModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {service.image ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {service.name}
                        </h3>
                        {service.category && (
                          <Badge variant="secondary">{service.category.name}</Badge>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration}min
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Euro className="h-3 w-3 mr-1" />
                          €{service.price}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Service Modal */}
      <Dialog open={showAddModal} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService 
                ? 'Update the service information below.'
                : 'Create a new service for your business.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter service name"
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Service description (optional)"
                rows={3}
                disabled={submitting}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Imagem do Serviço</Label>
              
              {formData.image ? (
                <div className="flex items-start space-x-4">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                    <Image
                      src={formData.image}
                      alt="Service Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-600">
                      Imagem carregada com sucesso.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      disabled={uploading || submitting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Sem imagem</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || submitting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading || submitting}
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Formatos suportados: JPG, PNG, WebP. Máximo: 5MB.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (€) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting 
                  ? (editingService ? 'Updating...' : 'Creating...') 
                  : (editingService ? 'Update Service' : 'Create Service')
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 