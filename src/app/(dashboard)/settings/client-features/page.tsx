'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  MessageSquare, 
  FileText, 
  Bell, 
  Shield, 
  QrCode,
  Settings,
  Save,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FeatureOption {
  id?: string;
  key: string;
  name: string;
  enabled: boolean;
}

interface FeatureConfig {
  id?: string;
  key: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  requiresApproval?: boolean;
  options?: FeatureOption[];
}

const defaultFeatures: FeatureConfig[] = [
  {
    key: 'appointments',
    name: 'Appointment Booking',
    description: 'Allow clients to schedule and manage their appointments',
    icon: CalendarDays,
    enabled: true,
    options: [
      { key: 'self_scheduling', name: 'Self-scheduling', enabled: true },
      { key: 'cancellation', name: 'Appointment cancellation', enabled: true },
      { key: 'reminders', name: 'Automated reminders', enabled: true }
    ]
  },
  {
    key: 'messaging',
    name: 'Secure Messaging',
    description: 'Enable secure communication between clients and providers',
    icon: MessageSquare,
    enabled: true,
    requiresApproval: true,
    options: [
      { key: 'direct_messaging', name: 'Direct messaging', enabled: true },
      { key: 'file_sharing', name: 'File sharing', enabled: true },
      { key: 'group_messages', name: 'Group messages', enabled: false }
    ]
  },
  {
    key: 'documents',
    name: 'Document Management',
    description: 'Allow clients to view and submit documents',
    icon: FileText,
    enabled: true,
    options: [
      { key: 'upload', name: 'Document upload', enabled: true },
      { key: 'e_sign', name: 'Electronic signatures', enabled: true },
      { key: 'forms', name: 'Online forms', enabled: true }
    ]
  },
  {
    key: 'notifications',
    name: 'Notifications',
    description: 'Configure client notification preferences',
    icon: Bell,
    enabled: true,
    options: [
      { key: 'email', name: 'Email notifications', enabled: true },
      { key: 'sms', name: 'SMS notifications', enabled: true },
      { key: 'push', name: 'Push notifications', enabled: false }
    ]
  },
  {
    key: 'check_in',
    name: 'Digital Check-in',
    description: 'Enable digital check-in features',
    icon: QrCode,
    enabled: true,
    options: [
      { key: 'qr_code', name: 'QR code check-in', enabled: true },
      { key: 'waiting_list', name: 'Virtual waiting room', enabled: true },
      { key: 'pre_visit', name: 'Pre-visit questionnaires', enabled: true }
    ]
  }
];

export default function ClientFeaturesSettings() {
  const [features, setFeatures] = useState<FeatureConfig[]>(defaultFeatures);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/features');
      if (!response.ok) {
        throw new Error('Failed to fetch features');
      }
      
      const data = await response.json();
      if (data.features) {
        // Map the API response to our feature config format
        const mappedFeatures = data.features.map((feature: any) => ({
          ...defaultFeatures.find(f => f.key === feature.key),
          ...feature,
          options: feature.options?.map((option: any) => ({
            ...option,
            enabled: option.enabled
          }))
        }));
        setFeatures(mappedFeatures);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to load feature settings');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = (featureKey: string) => {
    setFeatures(features.map(feature => {
      if (feature.key === featureKey) {
        return {
          ...feature,
          enabled: !feature.enabled,
          options: feature.options?.map(opt => ({ ...opt, enabled: !feature.enabled }))
        };
      }
      return feature;
    }));
    setHasChanges(true);
  };

  const toggleOption = (featureKey: string, optionKey: string) => {
    setFeatures(features.map(feature => {
      if (feature.key === featureKey) {
        return {
          ...feature,
          options: feature.options?.map(opt => 
            opt.key === optionKey ? { ...opt, enabled: !opt.enabled } : opt
          )
        };
      }
      return feature;
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error('Failed to save features');
      }

      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Client Portal Features</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure which features are available to clients
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.key} className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.name}
                      {feature.requiresApproval && (
                        <Shield className="ml-2 inline-block h-4 w-4 text-amber-500" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleFeature(feature.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      feature.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        feature.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            {feature.options && (
              <div className="divide-y divide-gray-200">
                {feature.options.map((option) => (
                  <div
                    key={option.key}
                    className={`flex items-center justify-between px-4 py-3 ${
                      !feature.enabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-3 h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {option.name}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleOption(feature.key, option.key)}
                      disabled={!feature.enabled}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        option.enabled && feature.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          option.enabled && feature.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 