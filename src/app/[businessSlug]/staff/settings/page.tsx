"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Save, Users, Tag, Settings as SettingsIcon, Package, Shield, Grid, Database, Eye, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import BusinessBrandingCard from '@/components/BusinessBrandingCard';

interface BusinessPermissions {
  allowStaffToViewAllBookings: boolean;
  restrictStaffToViewAllClients: boolean;
  restrictStaffToViewAllNotes: boolean;
  requireAdminCancelApproval: boolean;
}

export default function StaffSettings() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Add missing permissions state
  const [permissions, setPermissions] = useState<BusinessPermissions>({
    allowStaffToViewAllBookings: false,
    restrictStaffToViewAllClients: false,
    restrictStaffToViewAllNotes: false,
    requireAdminCancelApproval: false,
  });
  
  // Business Hours State
  const [businessHours, setBusinessHours] = useState([
    { day: 1, name: 'Segunda', isOpen: false, start: '09:00', end: '18:00' },
    { day: 2, name: 'Terça', isOpen: false, start: '09:00', end: '18:00' },
    { day: 3, name: 'Quarta', isOpen: false, start: '09:00', end: '18:00' },
    { day: 4, name: 'Quinta', isOpen: false, start: '09:00', end: '18:00' },
    { day: 5, name: 'Sexta', isOpen: false, start: '09:00', end: '18:00' },
    { day: 6, name: 'Sábado', isOpen: false, start: '09:00', end: '18:00' },
    { day: 0, name: 'Domingo', isOpen: false, start: '09:00', end: '18:00' }
  ]);

  // Hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load business hours and permissions
  useEffect(() => {
    if (mounted && !authLoading && user?.businessSlug) {
      loadBusinessHours();
      fetchBusinessPermissions();
    }
  }, [mounted, authLoading, user?.businessSlug]);

  const loadBusinessHours = async () => {
    try {
      const response = await fetch('/api/business/hours', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          // Map API data to our state structure
          const mappedHours = businessHours.map(dayTemplate => {
            const dayData = data.data.find((h: any) => h.day === dayTemplate.day);
            return {
              ...dayTemplate,
              isOpen: dayData?.isOpen || false,
              start: dayData?.start || '09:00',
              end: dayData?.end || '18:00'
            };
          });
          setBusinessHours(mappedHours);
        }
      }
    } catch (error) {
      console.error('Error loading business hours:', error);
    }
  };

  const saveBusinessHours = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/business/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          hours: businessHours.map(h => ({
            day: h.day,
            isOpen: h.isOpen,
            start: h.isOpen ? h.start : null,
            end: h.isOpen ? h.end : null
          }))
        })
      });
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Horários de funcionamento guardados com sucesso"
        });
      } else {
        throw new Error('Falha ao guardar horários');
      }
    } catch (error) {
      console.error('Error saving business hours:', error);
      toast({
        title: "Erro",
        description: "Falha ao guardar horários de funcionamento",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateBusinessHour = (dayIndex: number, field: string, value: any) => {
    const updated = [...businessHours];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setBusinessHours(updated);
  };

  const settingsOptions = [
    {
      title: 'Services',
      description: 'Manage your business services and pricing',
      icon: Package,
      href: `/${user?.businessSlug}/staff/settings/services`,
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      description: 'Organize services into categories',
      icon: Tag,
      href: `/${user?.businessSlug}/staff/settings/categories`,
      color: 'text-green-600'
    },
    {
      title: 'Staff',
      description: 'Manage staff members and permissions',
      icon: Users,
      href: `/${user?.businessSlug}/staff/settings/staff`,
      color: 'text-purple-600'
    }
  ];

  const fetchBusinessPermissions = async () => {
    try {
      const response = await fetch('/api/business/info');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPermissions({
            allowStaffToViewAllBookings: data.data.allowStaffToViewAllBookings || false,
            restrictStaffToViewAllClients: data.data.restrictStaffToViewAllClients || false,
            restrictStaffToViewAllNotes: data.data.restrictStaffToViewAllNotes || false,
            requireAdminCancelApproval: data.data.requireAdminCancelApproval || false,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching business permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/business/info', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissions),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Configurações de permissões salvas com sucesso!",
        });
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePermission = (field: keyof BusinessPermissions, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  // 🔥 Loading states after mounting
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
          <p className="text-red-600">Unable to load business settings. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your business settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            onClick={() => console.log('🔧 General tab clicked')}
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="permissions" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            onClick={() => console.log('🔧 Permissions tab clicked')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Permissões de Staff
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
              <CardDescription>
                Manage the core aspects of your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  href={`/${user?.businessSlug}/staff/settings/services`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Package className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Services</span>
                </Link>
                <Link 
                  href={`/${user?.businessSlug}/staff/settings/staff`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium">Staff</span>
                </Link>
                <Link 
                  href={`/${user?.businessSlug}/staff/settings/categories`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Grid className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Categories</span>
                </Link>
                <Link 
                  href={`/${user?.businessSlug}/staff/settings/hours`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Clock className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium">Horários</span>
                </Link>
                <Link 
                  href={`/${user?.businessSlug}/staff/schedule`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium">Schedule</span>
                </Link>
                <Link 
                  href={`/${user?.businessSlug}/staff/settings/staff-schedules`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium">Horários Staff</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription>
                View and manage your business profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Business Name</Label>
                    <p className="text-sm text-gray-900">{user?.businessName || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Business Slug</Label>
                    <p className="text-sm text-gray-900">{user?.businessSlug || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Your Role</Label>
                    <p className="text-sm text-gray-900">{user?.staffRole || user?.role || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Email</Label>
                    <p className="text-sm text-gray-900">{user?.email || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Branding - MOVED TO BOTTOM */}
          <BusinessBrandingCard businessSlug={user?.businessSlug} />
        </TabsContent>

        {/* Staff Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Staff Permissions
              </CardTitle>
              <CardDescription>
                Control what your staff members can view and do
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading permissions...</p>
                </div>
              ) : (
                <>
                  {/* Booking Permissions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Booking Permissions
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="view-all-bookings" className="font-medium">
                            Allow staff to view all bookings
                          </Label>
                          <p className="text-sm text-gray-500">
                            When enabled, staff can see bookings from all staff members
                          </p>
                        </div>
                        <Switch
                          id="view-all-bookings"
                          checked={permissions.allowStaffToViewAllBookings}
                          onCheckedChange={(value) => updatePermission('allowStaffToViewAllBookings', value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Client Permissions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Client Permissions
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="restrict-client-view" className="font-medium">
                            Restrict staff to view all clients
                          </Label>
                          <p className="text-sm text-gray-500">
                            When enabled, staff can only see their own clients
                          </p>
                        </div>
                        <Switch
                          id="restrict-client-view"
                          checked={permissions.restrictStaffToViewAllClients}
                          onCheckedChange={(value) => updatePermission('restrictStaffToViewAllClients', value)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="restrict-notes-view" className="font-medium">
                            Restrict staff to view all notes
                          </Label>
                          <p className="text-sm text-gray-500">
                            When enabled, staff can only see notes they created
                          </p>
                        </div>
                        <Switch
                          id="restrict-notes-view"
                          checked={permissions.restrictStaffToViewAllNotes}
                          onCheckedChange={(value) => updatePermission('restrictStaffToViewAllNotes', value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Administrative Permissions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Administrative Controls
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="admin-cancel-approval" className="font-medium">
                            Require admin approval for cancellations
                          </Label>
                          <p className="text-sm text-gray-500">
                            When enabled, staff must get admin approval to cancel appointments
                          </p>
                        </div>
                        <Switch
                          id="admin-cancel-approval"
                          checked={permissions.requireAdminCancelApproval}
                          onCheckedChange={(value) => updatePermission('requireAdminCancelApproval', value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={savePermissions}
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Permissions'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 