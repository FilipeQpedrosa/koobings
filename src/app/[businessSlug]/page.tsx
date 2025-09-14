'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Star, 
  Calendar,
  Users,
  Euro,
  ArrowRight,
  Mail,
  Award,
  CheckCircle,
  Heart,
  Share2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalCustomerHeader } from '@/components/layout/GlobalCustomerHeader';

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  phone: string;
  address: string;
  website: string;
  email: string;
  type: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  }>;
  staff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  settings: any;
}

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const businessSlug = params.businessSlug as string;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        console.log('🔍 [BusinessProfile] Fetching business:', businessSlug);
        
        const response = await fetch(`/api/business/by-slug/${businessSlug}`);
        
        if (!response.ok) {
          throw new Error('Business not found');
        }
        
        const data = await response.json();
        console.log('✅ [BusinessProfile] Business data:', data);
        setBusiness(data.data);
      } catch (err) {
        console.error('❌ [BusinessProfile] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load business');
      } finally {
        setLoading(false);
      }
    };

    if (businessSlug) {
      fetchBusiness();
    }
  }, [businessSlug]);

  // Check if business is favorited when business data is loaded
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!business?.id) return;
      
      try {
        const response = await fetch(`/api/customer/favorites/${business.id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsFavorite(data.data.isFavorite);
            console.log('✅ [BusinessProfile] Favorite status:', data.data.isFavorite);
          }
        } else if (response.status === 401) {
          // Expected when not logged in, just ignore
          console.log('ℹ️ [BusinessProfile] Not logged in for favorite check (expected)');
        }
      } catch (error) {
        console.log('❌ [BusinessProfile] Could not check favorite status:', error);
        // Not critical, just continue
      }
    };

    // Only check once when business ID is available
    if (business?.id && !loading) {
      checkFavoriteStatus();
    }
  }, [business?.id, loading]); // Added loading to ensure it only runs after business is loaded

  const handleToggleFavorite = async () => {
    if (!business?.id) return;

    try {
      const action = isFavorite ? 'remove' : 'add';
      
      const response = await fetch('/api/customer/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          businessId: business.id,
          action: action
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsFavorite(!isFavorite);
          console.log(`✅ [BusinessProfile] ${action === 'add' ? 'Added to' : 'Removed from'} favorites`);
        }
      } else {
        console.error('❌ [BusinessProfile] Failed to toggle favorite');
      }
    } catch (error) {
      console.error('❌ [BusinessProfile] Error toggling favorite:', error);
    }
  };

  const handleBookService = (serviceId?: string) => {
    const url = serviceId 
      ? `/book?businessSlug=${business?.slug}&serviceId=${serviceId}`
      : `/book?businessSlug=${business?.slug}`;
    router.push(url);
  };

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${duration}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalCustomerHeader />
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">A carregar negócio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalCustomerHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Negócio não encontrado</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/')}>
              Voltar à página inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalCustomerHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500">Negócio não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const businessHours = business.settings?.businessHours || {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '14:00', closed: true },
  };

  const dayNames = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const dayNamesShort = {
    monday: 'Seg',
    tuesday: 'Ter',
    wednesday: 'Qua',
    thursday: 'Qui',
    friday: 'Sex',
    saturday: 'Sáb',
    sunday: 'Dom'
  };

  // Function to group consecutive days with same hours
  const groupBusinessHours = (hours: BusinessHours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const groups: Array<{
      days: string[];
      hours: { open: string; close: string; closed: boolean };
    }> = [];

    let currentGroup: {
      days: string[];
      hours: { open: string; close: string; closed: boolean };
    } | null = null;

    days.forEach(day => {
      const dayHours = hours[day];
      const hoursKey = dayHours.closed ? 'CLOSED' : `${dayHours.open}-${dayHours.close}`;

      if (!currentGroup || 
          (currentGroup.hours.closed !== dayHours.closed) ||
          (!dayHours.closed && (currentGroup.hours.open !== dayHours.open || currentGroup.hours.close !== dayHours.close))) {
        // Start new group
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          days: [day],
          hours: dayHours
        };
      } else {
        // Add to current group
        currentGroup.days.push(day);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const formatDayRange = (days: string[]) => {
    if (days.length === 1) {
      return dayNamesShort[days[0] as keyof typeof dayNamesShort];
    } else if (days.length === 2) {
      return `${dayNamesShort[days[0] as keyof typeof dayNamesShort]}-${dayNamesShort[days[1] as keyof typeof dayNamesShort]}`;
    } else {
      return `${dayNamesShort[days[0] as keyof typeof dayNamesShort]}-${dayNamesShort[days[days.length - 1] as keyof typeof dayNamesShort]}`;
    }
  };

  const groupedHours = groupBusinessHours(businessHours as BusinessHours);

  type BusinessHours = {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalCustomerHeader />

      {/* Hero Section - Clean & Discrete Layout */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Business Info & Team Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* LEFT SIDE - Business Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              {/* Business Header */}
              <div className="flex items-center space-x-4 mb-6">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-16 h-16 rounded-lg object-cover border border-white/20"
                    onError={(e) => {
                      console.error('Logo failed to load:', business.logo);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2 text-xs">
                    {business.type}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-white/80">5.0 • 127 avaliações</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {business.name}
              </h1>
              
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                {business.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                {business.address && (
                  <div className="flex items-center space-x-3 text-white/90">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{business.address}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center space-x-3 text-white/90">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{business.phone}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center space-x-3 text-white/90">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{business.email}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 font-semibold"
                  onClick={() => handleBookService()}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Agora
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className={`border px-4 py-2 font-medium transition-all duration-300 ${
                    isFavorite 
                      ? 'border-red-400 bg-red-500 text-white hover:bg-red-600' 
                      : 'border-white/50 bg-white/10 text-white hover:bg-white hover:text-red-500'
                  }`}
                  onClick={() => handleToggleFavorite()}
                >
                  <Heart className={`mr-2 h-4 w-4 ${
                    isFavorite ? 'fill-white' : ''
                  }`} />
                  {isFavorite ? 'Favorito' : 'Favoritar'}
                </Button>
              </div>
            </motion.div>

            {/* RIGHT SIDE - Team & Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Team Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Equipa Profissional</h3>
                  </div>
                  {business.staff.length > 3 && (
                    <button 
                      className="text-white/70 hover:text-white text-xs flex items-center space-x-1"
                      onClick={() => {
                        const element = document.getElementById('team-expanded');
                        if (element) {
                          element.style.display = element.style.display === 'none' ? 'block' : 'none';
                        }
                      }}
                    >
                      <span>Ver todos</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
                
                {business.staff.length > 0 ? (
                  <div className="space-y-3">
                    {/* Show first 3 team members */}
                    {business.staff.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{member.name}</p>
                          <p className="text-white/70 text-xs">{member.role}</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      </div>
                    ))}
                    
                    {/* Expandable section for remaining team members */}
                    {business.staff.length > 3 && (
                      <div id="team-expanded" style={{ display: 'none' }} className="space-y-3 pt-2 border-t border-white/20">
                        {business.staff.slice(3).map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-medium text-sm">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-sm truncate">{member.name}</p>
                              <p className="text-white/70 text-xs">{member.role}</p>
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-white/70 text-center py-4 text-sm">
                    Equipa em breve
                  </p>
                )}
              </div>

              {/* Business Hours - Below Team */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-semibold text-white">Horário de Funcionamento</h3>
                </div>
                
                <div className="space-y-2">
                  {groupedHours.map((group, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-white/90 text-sm font-medium">
                        {formatDayRange(group.days)}
                      </span>
                      <span className="text-sm">
                        {group.hours.closed ? (
                          <span className="text-red-300">Fechado</span>
                        ) : (
                          <span className="text-green-300">{group.hours.open} - {group.hours.close}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Compact & Focused */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Descubra os nossos serviços</h2>
            
            {/* MAIN BOOKING BUTTON - More Prominent */}
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
              onClick={() => handleBookService()}
            >
              <Calendar className="mr-2 h-5 w-5" />
              🎯 AGENDAR AGORA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mb-4">
              ⚡ Escolha o serviço e profissional durante o agendamento
            </p>
          </motion.div>

          {/* Services Display - Compact Grid */}
          {business.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <AnimatePresence>
                {business.services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Card className="h-full border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                          
                          {/* Price and Duration - Prominent */}
                          <div className="flex items-center justify-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1 text-blue-600 font-bold text-lg">
                              <Euro className="h-5 w-5" />
                              <span>{service.price}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{formatDuration(service.duration)}</span>
                            </div>
                          </div>
                          
                          {/* Description - Compact */}
                          {service.description && (
                            <p className="text-gray-600 text-xs leading-tight">{service.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Serviços em breve</h3>
              <p className="text-gray-500 text-sm">Este negócio está a adicionar os seus serviços.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}