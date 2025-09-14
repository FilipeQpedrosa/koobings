'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GlobalCustomerHeader } from '@/components/layout/GlobalCustomerHeader';

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

export default function HomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchQuery, selectedType]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Homepage] Fetching businesses...');
      
      const response = await fetch('/api/customer/marketplace/businesses', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBusinesses(data.data || []);
          console.log('✅ [Homepage] Loaded businesses:', data.data?.length || 0);
        } else {
          console.error('❌ [Homepage] API returned error:', data);
          setError('Falha ao carregar negócios');
        }
      } else {
        console.error('❌ [Homepage] HTTP error:', response.status);
        setError('Falha ao carregar negócios');
      }
    } catch (error) {
      console.error('❌ [Homepage] Network error fetching businesses:', error);
      setError('Erro de rede ao carregar negócios');
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = businesses;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.services.some(service => service.name.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(business => business.type === selectedType);
    }

    setFilteredBusinesses(filtered);
  };

  const getUniqueTypes = () => {
    const types = businesses.map(b => b.type).filter(Boolean);
    return Array.from(new Set(types));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">A carregar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Erro ao Carregar</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchBusinesses}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Customer Header */}
      <GlobalCustomerHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Agende o seu
              <span className="block text-yellow-300">próximo serviço</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Descubra profissionais qualificados e marque agendamentos de forma simples e rápida
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Pesquisar por negócio ou serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="all">Todos os tipos</option>
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBusinesses.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchQuery || selectedType !== 'all' 
                    ? `${filteredBusinesses.length} resultado${filteredBusinesses.length !== 1 ? 's' : ''} encontrado${filteredBusinesses.length !== 1 ? 's' : ''}`
                    : `${filteredBusinesses.length} negócio${filteredBusinesses.length !== 1 ? 's' : ''} disponível${filteredBusinesses.length !== 1 ? 'eis' : ''}`
                  }
                </h2>
                <p className="text-gray-600">
                  Escolha um negócio para ver serviços e agendar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredBusinesses.map((business, index) => (
                    <motion.div
                      key={business.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Link href={`/${business.slug}`}>
                        <Card className="group hover:shadow-xl transition-all duration-300 h-full cursor-pointer border-0 shadow-md">
                          <CardContent className="p-6">
                            {/* Business Header */}
                            <div className="flex items-start space-x-4 mb-4">
                              {business.logo ? (
                                <img
                                  src={business.logo}
                                  alt={business.name}
                                  className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-xl">
                                    {business.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {business.name}
                                  </h3>
                                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                                
                                <Badge variant="secondary" className="mb-2">
                                  {business.type}
                                </Badge>
                                
                                {business.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{business.rating}</span>
                                    <span className="text-sm text-gray-500">({business.reviewCount} avaliações)</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            {business.description && (
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {business.description}
                              </p>
                            )}

                            {/* Address */}
                            {business.address && (
                              <div className="flex items-center space-x-2 text-gray-500 text-sm mb-4">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="line-clamp-1">{business.address}</span>
                              </div>
                            )}

                            {/* Services Preview */}
                            {business.services.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Serviços disponíveis:
                                </p>
                                <div className="space-y-2">
                                  {business.services.slice(0, 3).map((service) => (
                                    <div key={service.id} className="flex justify-between items-center text-sm">
                                      <span className="text-gray-700 line-clamp-1">{service.name}</span>
                                      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                        <span className="text-gray-500">{formatDuration(service.duration)}</span>
                                        <span className="font-semibold text-green-600">{formatPrice(service.price)}</span>
                                      </div>
                                    </div>
                                  ))}
                                  {business.services.length > 3 && (
                                    <p className="text-xs text-gray-500 text-center pt-1">
                                      +{business.services.length - 3} mais serviços
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Staff Count */}
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                              <span>{business.staff.length} profissional{business.staff.length !== 1 ? 'is' : ''}</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Agendar agora</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-300 text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery || selectedType !== 'all' 
                  ? 'Nenhum resultado encontrado'
                  : 'Nenhum negócio disponível'
                }
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || selectedType !== 'all'
                  ? 'Tente ajustar os filtros de pesquisa ou procure por outros termos.'
                  : 'Não há negócios disponíveis para agendamento no momento.'
                }
              </p>
              {(searchQuery || selectedType !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                  variant="outline"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 