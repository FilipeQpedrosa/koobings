'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences?: {
    id: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminderTime: number;
    marketingEmails: boolean;
  };
  appointments?: Array<{
    id: string;
    startTime: string;
    endTime: string;
    service: {
      name: string;
    };
    staff: {
      name: string;
    };
  }>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/patient/signin?callbackUrl=/profile');
      return;
    }

    // Fetch profile data
    fetch('/api/client/profile')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
        setIsLoading(false);
      });
  }, [session, status, router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      emailNotifications: formData.get('emailNotifications') === 'on',
      smsNotifications: formData.get('smsNotifications') === 'on',
      reminderTime: parseInt(formData.get('reminderTime') as string) || 24,
      marketingEmails: formData.get('marketingEmails') === 'on',
    };

    try {
      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={profile?.name}
                  required
                  disabled={isSaving}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ''}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    name="emailNotifications"
                    defaultChecked={profile?.preferences?.emailNotifications}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    name="smsNotifications"
                    defaultChecked={profile?.preferences?.smsNotifications}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <Label htmlFor="reminderTime">Reminder Time (hours before appointment)</Label>
                  <Input
                    id="reminderTime"
                    name="reminderTime"
                    type="number"
                    min="1"
                    max="72"
                    defaultValue={profile?.preferences?.reminderTime || 24}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <Switch
                    id="marketingEmails"
                    name="marketingEmails"
                    defaultChecked={profile?.preferences?.marketingEmails}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {profile?.appointments && profile.appointments.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.appointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="font-medium">{appointment.service.name}</div>
                  <div className="text-sm text-gray-500">
                    with {appointment.staff.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(appointment.startTime).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 