'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User, 
  Calendar, 
  Clock, 
  Settings, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  History,
  CreditCard,
  Bell,
  LogOut,
  Edit3,
  Plus,
  Filter,
  Search,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  type: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
  }>;
}

interface Favorite {
  id: string;
  businessId: string;
  createdAt: string;
  business: Business | null;
}

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences?: any;
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  scheduledFor: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  service: {
    id: string;
    name: string;
    price: number;
  };
  staff: {
    id: string;
    name: string;
  };
  business: {
    id: string;
    name: string;
  };
}

export default function ClientProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    fetchClientData();
    fetchFavorites();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      
      // Fetch client profile and businesses in parallel
      const [profileRes, businessesRes] = await Promise.all([
        fetch('/api/customer/profile', { credentials: 'include' }),
        fetch('/api/customer/marketplace/businesses', { credentials: 'include' })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.data);
          setEditForm({
            name: profileData.data.name || '',
            phone: profileData.data.phone || ''
          });
        }
      }

      if (businessesRes.ok) {
        const businessData = await businessesRes.json();
        if (businessData.success) {
          setBusinesses(businessData.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const response = await fetch('/api/customer/favorites', { 
        credentials: 'include' 
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(data.data || []);
          console.log('✅ [CustomerProfile] Loaded favorites:', data.data?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar favoritos.",
        variant: "destructive"
      });
    } finally {
      setFavoritesLoading(false);
    }
  };

  const removeFavorite = async (businessId: string) => {
    try {
      const response = await fetch('/api/customer/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          businessId: businessId,
          action: 'remove'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Remove from local state
          setFavorites(prev => prev.filter(fav => fav.businessId !== businessId));
          toast({
            title: "Removido",
            description: "Negócio removido dos favoritos."
          });
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover favorito.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch('/api/customer/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
          setIsEditingProfile(false);
          toast({
            title: "Sucesso",
            description: "Perfil atualizado com sucesso!"
          });
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil.",
        variant: "destructive"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear NextAuth session if it exists
      try {
        const { signOut } = await import('next-auth/react');
        await signOut({ redirect: false });
      } catch (error) {
        console.log('NextAuth not available, continuing with manual logout');
      }
      
      // Clear ALL session and local storage
      sessionStorage.clear();
      localStorage.clear();
      
      // Clear all cookies manually
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Clear for current path and domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        // Clear for parent domains
        const parts = window.location.hostname.split('.');
        while (parts.length > 1) {
          parts.shift();
          const domain = '.' + parts.join('.');
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
        }
      });
      
      // Call logout API to clear server-side session
      try {
        await fetch('/api/auth/client/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.log('Logout API call failed, but continuing with client cleanup');
      }
      
      // Force complete page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force page reload even if logout fails
      window.location.href = '/';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAppointments = profile?.appointments?.filter(appointment => {
    const matchesSearch = appointment.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.business.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const upcomingAppointments = filteredAppointments.filter(
    app => new Date(app.scheduledFor) > new Date() && app.status !== 'CANCELLED'
  );

  const pastAppointments = filteredAppointments.filter(
    app => new Date(app.scheduledFor) <= new Date() || app.status === 'COMPLETED'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-gray-600">Gerir agendamentos e preferências</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Agendamento</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-xl">{profile?.name || 'Cliente'}</CardTitle>
                <p className="text-gray-600 text-sm">{profile?.email}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {upcomingAppointments.length}
                    </div>
                    <div className="text-xs text-blue-600">Próximos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {pastAppointments.filter(a => a.status === 'COMPLETED').length}
                    </div>
                    <div className="text-xs text-green-600">Concluídos</div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{profile?.email}</span>
                  </div>
                  
                  {profile?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{profile.phone}</span>
                    </div>
                  )}
                </div>

                {/* Edit Profile Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Agendamentos</span>
                </TabsTrigger>
                
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>Histórico</span>
                </TabsTrigger>
                
                <TabsTrigger value="favorites" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Favoritos</span>
                </TabsTrigger>
              </TabsList>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Pesquisar agendamentos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Todos os estados</option>
                        <option value="PENDING">Pendente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="COMPLETED">Concluído</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      Próximos Agendamentos
                    </h3>
                    
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    {getStatusIcon(appointment.status)}
                                    <h4 className="font-semibold text-lg">{appointment.service.name}</h4>
                                    <Badge className={getStatusColor(appointment.status)}>
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>{appointment.business.name}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4" />
                                      <span>{appointment.staff.name}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {format(new Date(appointment.scheduledFor), "d 'de' MMMM, yyyy", { locale: ptBR })}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {format(new Date(appointment.scheduledFor), 'HH:mm')} ({appointment.duration} min)
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {appointment.notes && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">
                                    €{appointment.service.price}
                                  </div>
                                  
                                  {appointment.status === 'PENDING' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      Cancelar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Upcoming Appointments */}
                {upcomingAppointments.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sem agendamentos próximos
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Não tem agendamentos marcados para os próximos dias.
                      </p>
                      <Button onClick={() => router.push('/')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agendar Agora
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <History className="h-5 w-5 mr-2 text-gray-600" />
                    Histórico de Agendamentos
                  </h3>
                  
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="opacity-80 hover:opacity-100 transition-opacity">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-1">
                                    {getStatusIcon(appointment.status)}
                                    <h4 className="font-medium">{appointment.service.name}</h4>
                                    <Badge className={getStatusColor(appointment.status)} variant="secondary">
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div>{appointment.business.name} • {appointment.staff.name}</div>
                                    <div>
                                      {format(new Date(appointment.scheduledFor), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="font-medium text-gray-900">
                                    €{appointment.service.price}
                                  </div>
                                  
                                  {appointment.status === 'COMPLETED' && (
                                    <Button size="sm" variant="outline" className="mt-1">
                                      <Star className="h-3 w-3 mr-1" />
                                      Avaliar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Sem histórico ainda
                        </h3>
                        <p className="text-gray-600">
                          O seu histórico de agendamentos aparecerá aqui após completar serviços.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Meus Favoritos
                  </h3>
                  
                  {favoritesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent mx-auto"></div>
                      <p className="mt-4 text-gray-600">A carregar favoritos...</p>
                    </div>
                  ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.filter(fav => fav.business).map((favorite) => (
                        <motion.div
                          key={favorite.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/${favorite.business!.slug}`)}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {favorite.business!.logo ? (
                                    <img
                                      src={favorite.business!.logo}
                                      alt={favorite.business!.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                      <span className="text-white font-bold">
                                        {favorite.business!.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{favorite.business!.name}</h4>
                                    {favorite.business!.address && (
                                      <p className="text-sm text-gray-600">{favorite.business!.address}</p>
                                    )}
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">
                                        {favorite.business!.type}
                                      </Badge>
                                      {favorite.business!.services.length > 0 && (
                                        <span className="text-xs text-gray-500">
                                          {favorite.business!.services.length} serviços
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/${favorite.business!.slug}`);
                                    }}
                                  >
                                    <ArrowRight className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFavorite(favorite.businessId);
                                    }}
                                  >
                                    <Heart className="h-3 w-3 fill-current" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Sem favoritos ainda
                        </h3>
                        <p className="text-gray-600">
                          Adicione negócios aos seus favoritos para facilmente encontrá-los.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsEditingProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Editar Perfil</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Digite o seu nome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Digite o seu telefone"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={profileLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={profileLoading}
                >
                  {profileLoading ? 'A guardar...' : 'Guardar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 