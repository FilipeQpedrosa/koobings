'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Star, 
  Calendar,
  Users,
  Euro,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
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
  const businessSlug = params.businessSlug as string;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        console.log('🔍 [BusinessProfile] Fetching business:', businessSlug);
        
        const response = await fetch(`/api/business/by-slug?slug=${businessSlug}`);
        
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business information...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The business you are looking for does not exist.'}</p>
          <Link href="/">
            <Button>Back to Marketplace</Button>
          </Link>
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

  type BusinessHours = {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {business.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
              <p className="text-gray-600 mb-4 max-w-2xl">{business.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {business.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Book Now Button */}
            <div className="flex-shrink-0">
              <Link href={`/book?businessSlug=${business.slug}`}>
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {business.services.length > 0 ? (
                  <div className="space-y-4">
                    {business.services.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Euro className="h-4 w-4" />
                              {service.price}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock className="h-3 w-3" />
                              {service.duration}min
                            </div>
                          </div>
                        </div>
                        {service.description && (
                          <p className="text-gray-600 mb-3">{service.description}</p>
                        )}
                        <Link href={`/book?businessSlug=${business.slug}&serviceId=${service.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Book This Service
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No services available at the moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Staff Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Our Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                {business.staff.length > 0 ? (
                  <div className="space-y-3">
                    {business.staff.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No staff information available.</p>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(businessHours as BusinessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-sm text-gray-600">
                        {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{business.phone}</span>
                  </div>
                )}
                {business.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{business.address}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-amber-600 hover:text-amber-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 