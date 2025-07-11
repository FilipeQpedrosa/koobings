'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, Euro, Filter, Grid, List, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  type: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
  }>;
  staff: Array<{
    id: string;
    name: string;
  }>;
  rating?: number;
  reviewCount?: number;
}

const categories = [
  { id: 'health', name: 'Saúde & Bem-estar', emoji: '🏥', color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { id: 'beauty', name: 'Beleza & Estética', emoji: '💆', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'professional', name: 'Serviços Profissionais', emoji: '💼', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: 'fitness', name: 'Fitness & Desporto', emoji: '🤸', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'other', name: 'Outros Serviços', emoji: '🎯', color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      console.log('🏢 Fetching all businesses for marketplace...');
      
      const response = await fetch('/api/client/marketplace/businesses');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🏢 Businesses response:', data);
      
      if (data.success) {
        setBusinesses(data.data || []);
        console.log('✅ Businesses loaded:', data.data?.length || 0);
      } else {
        throw new Error(data.error?.message || 'Failed to load businesses');
      }
    } catch (error) {
      console.error('❌ Error fetching businesses:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar negócios. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = !searchQuery || 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.services?.some(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = !selectedCategory || business.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleBusinessClick = (business: Business) => {
    router.push(`/book?businessSlug=${business.slug}`);
  };

  const formatPrice = (price: number) => {
    return `€${price}`;
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="h-96 bg-stone-100 animate-pulse rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-stone-100 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Completely New Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-stone-900 to-neutral-800">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white z-10"
            >
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8"
                >
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  Plataforma Koobings
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl lg:text-6xl xl:text-7xl font-light leading-tight mb-8"
                >
                  Conectamos{' '}
                  <span className="block">
                    <span className="font-normal text-amber-400">talento</span> e{' '}
                    <span className="font-normal text-stone-300">oportunidade</span>
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-stone-300 leading-relaxed mb-10 max-w-lg"
                >
                  Descubra profissionais excepcionais. Agende experiências únicas. 
                  Tudo numa plataforma elegante e simples.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-8 py-4 rounded-full h-auto"
                    onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explorar Serviços
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full h-auto"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Como Funciona
                  </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-8"
                >
                  <div>
                    <div className="text-2xl font-semibold text-white">{businesses.length}+</div>
                    <div className="text-sm text-stone-400">Profissionais</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white">5.0</div>
                    <div className="text-sm text-stone-400">Avaliação Média</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white">24h</div>
                    <div className="text-sm text-stone-400">Disponibilidade</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800">Agendamento Confirmado</h3>
                      <p className="text-sm text-stone-600">Consulta Jurídica • João Maria</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-stone-600">
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">22 Jan, 2024 • 10:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duração:</span>
                      <span className="font-medium">60 minutos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span className="font-semibold text-stone-800">€85</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-stone-600">Avalie a sua experiência</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 bg-emerald-500 text-white px-3 py-2 rounded-full text-xs font-medium"
                >
                  Disponível Agora
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute -bottom-4 -right-4 bg-stone-800 text-white px-3 py-2 rounded-full text-xs font-medium"
                >
                  +127 avaliações
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div id="search-section" className="py-16 bg-stone-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              O que procura hoje?
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Encontre exactamente o que precisa entre centenas de serviços profissionais
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative max-w-3xl mx-auto mb-12"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 h-6 w-6" />
            <Input
              type="text"
              placeholder="Procurar por serviços, profissionais ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-8 py-6 text-lg bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 placeholder:text-stone-400"
            />
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`h-auto py-3 px-6 rounded-full transition-all duration-200 ${
                selectedCategory === null 
                  ? 'bg-stone-800 text-white hover:bg-stone-900' 
                  : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              Todas as Categorias
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => setSelectedCategory(category.id)}
                className={`h-auto py-3 px-5 gap-3 rounded-full transition-all duration-200 border ${
                  selectedCategory === category.id 
                    ? 'bg-stone-800 text-white border-stone-800' 
                    : `${category.color} hover:bg-opacity-80`
                }`}
              >
                <span className="text-base">{category.emoji}</span>
                <span className="font-normal">{category.name}</span>
              </Button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-16">
        {/* View Controls */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-light text-stone-800">
              {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}
              {selectedCategory && (
                <span className="text-stone-500 ml-2 font-normal text-lg">
                  em {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-full ${
                viewMode === 'grid' 
                  ? 'bg-stone-800 text-white' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-full ${
                viewMode === 'list' 
                  ? 'bg-stone-800 text-white' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        {filteredBusinesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-stone-300 text-5xl mb-6">🔍</div>
            <h3 className="text-xl font-light text-stone-600 mb-3">
              Nenhum profissional encontrado
            </h3>
            <p className="text-stone-500">
              Tente ajustar a sua pesquisa ou escolha uma categoria diferente
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {filteredBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-xl transition-all duration-500 group overflow-hidden bg-white border-stone-200/60 rounded-2xl"
                  onClick={() => handleBusinessClick(business)}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 via-stone-100 to-neutral-100 relative overflow-hidden">
                    {business.logo ? (
                      <img 
                        src={business.logo} 
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500 text-2xl font-light">
                        {business.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-stone-600 font-normal border-stone-200/50">
                        {business.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-light group-hover:text-stone-600 transition-colors leading-tight">
                        {business.name}
                      </h3>
                      {business.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-normal text-stone-600">{business.rating}</span>
                          {business.reviewCount && (
                            <span className="text-xs text-stone-400">
                              ({business.reviewCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {business.address && (
                      <div className="flex items-center gap-2 text-stone-500 mb-4">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{business.address}</span>
                      </div>
                    )}
                    
                    {business.description && (
                      <p className="text-stone-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {business.description}
                      </p>
                    )}
                    
                    {business.services && business.services.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-normal text-stone-700 mb-3">Serviços em destaque</h4>
                        <div className="space-y-2">
                          {business.services.slice(0, 3).map((service) => (
                            <div key={service.id} className="flex justify-between text-sm">
                              <span className="text-stone-600 flex-1">{service.name}</span>
                              <div className="flex gap-3 text-stone-500 ml-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(service.duration)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Euro className="h-3 w-3" />
                                  {formatPrice(service.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                          {business.services.length > 3 && (
                            <div className="text-xs text-stone-400 italic">
                              +{business.services.length - 3} outros serviços
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                      <div className="text-sm text-stone-500">
                        {(business.staff?.length || 0)} {(business.staff?.length || 0) === 1 ? 'profissional' : 'profissionais'}
                      </div>
                      <Button 
                        size="sm" 
                        className="group-hover:bg-amber-600 bg-amber-500 text-black rounded-full px-6 hover:shadow-md transition-all duration-300 font-medium"
                      >
                        Agendar
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 