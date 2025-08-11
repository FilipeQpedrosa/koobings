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
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

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
      if (minutes === 0) return `${hours}h`;
      return `${hours}h ${minutes}min`;
    }
    return `${duration}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-stone-600 font-light">A carregar informações...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-stone-300 text-6xl mb-6">🏢</div>
          <h1 className="text-2xl font-light text-stone-800 mb-3">Negócio Não Encontrado</h1>
          <p className="text-stone-600 mb-6">O negócio que procura não existe ou não está disponível.</p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full px-8"
          >
            Voltar ao Marketplace
          </Button>
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

  type BusinessHours = {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-neutral-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-stone-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <div className="flex items-center gap-4 mb-6">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {business.type}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">5.0 • 127 avaliações</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
                {business.name}
              </h1>
              
              <p className="text-xl text-stone-300 leading-relaxed mb-8 max-w-lg">
                {business.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                {business.address && (
                  <div className="flex items-center gap-3 text-stone-300">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-3 text-stone-300">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-3 text-stone-300">
                    <Globe className="h-5 w-5 flex-shrink-0" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Visitar Website
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-8 py-4 rounded-full h-auto"
                  onClick={() => handleBookService()}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Agora
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 rounded-full h-auto p-4"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 rounded-full h-auto p-4"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Right Visual - Team Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-amber-500" />
                  <h3 className="font-semibold text-stone-800">Equipa Profissional</h3>
                </div>
                
                {business.staff.length > 0 ? (
                  <div className="space-y-4">
                    {business.staff.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-400 to-stone-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-800">{member.name}</p>
                          <p className="text-sm text-stone-600">{member.role}</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                    ))}
                    {business.staff.length > 3 && (
                      <p className="text-sm text-stone-500 text-center pt-2">
                        +{business.staff.length - 3} outros profissionais
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-stone-500 text-center py-4">
                    Informações da equipa em breve
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-stone-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Descubra a nossa gama completa de serviços profissionais
            </p>
          </motion.div>

          {business.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {business.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-500 group bg-white border-stone-200/60 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-light group-hover:text-stone-600 transition-colors leading-tight">
                          {service.name}
                        </h3>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-600 font-semibold text-lg">
                            <Euro className="h-4 w-4" />
                            {service.price}
                          </div>
                          <div className="flex items-center gap-1 text-stone-500 text-sm">
                            <Clock className="h-3 w-3" />
                            {formatDuration(service.duration)}
                          </div>
                        </div>
                      </div>
                      
                      {service.description && (
                        <p className="text-stone-600 mb-6 line-clamp-3 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      
                      <Button 
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full transition-all duration-300"
                        onClick={() => handleBookService(service.id)}
                      >
                        Agendar Serviço
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-stone-300 text-5xl mb-6">🎯</div>
              <h3 className="text-xl font-light text-stone-600 mb-3">
                Serviços em Preparação
              </h3>
              <p className="text-stone-500">
                Novos serviços serão adicionados em breve
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-stone-200/60 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-stone-800">
                    <Clock className="h-6 w-6 text-emerald-500" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(businessHours as BusinessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                        <span className="font-medium text-stone-700">
                          {dayNames[day as keyof typeof dayNames]}
                        </span>
                        <span className={`text-sm ${hours.closed ? 'text-stone-400' : 'text-stone-600'}`}>
                          {hours.closed ? 'Fechado' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact & Team */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Contact Info */}
              <Card className="border-stone-200/60 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-stone-800">
                    <Mail className="h-6 w-6 text-blue-500" />
                    Contactos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.phone && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">Telefone</p>
                        <p className="text-stone-600">{business.phone}</p>
                      </div>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">Email</p>
                        <p className="text-stone-600">{business.email}</p>
                      </div>
                    </div>
                  )}
                  {business.address && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">Morada</p>
                        <p className="text-stone-600">{business.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team */}
              {business.staff.length > 0 && (
                <Card className="border-stone-200/60 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-stone-800">
                      <Users className="h-6 w-6 text-purple-500" />
                      Nossa Equipa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {business.staff.map((member) => (
                        <div key={member.id} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-stone-800">{member.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 