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
}

export default function MyProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emailNotifications: true,
    smsNotifications: false,
    reminderTime: 24,
    marketingEmails: true
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/my-profile');
      return;
    }

    fetchProfile();
  }, [session, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/client/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        emailNotifications: data.preferences?.emailNotifications ?? true,
        smsNotifications: data.preferences?.smsNotifications ?? false,
        reminderTime: data.preferences?.reminderTime ?? 24,
        marketingEmails: data.preferences?.marketingEmails ?? true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your personal details and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, smsNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <Switch
                    id="marketingEmails"
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked) => setFormData({ ...formData, marketingEmails: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Reminder Time (hours before appointment)</Label>
                  <Input
                    id="reminderTime"
                    type="number"
                    min="1"
                    max="72"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <Label>Email</Label>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
              <div>
                <Label>Name</Label>
                <p className="text-gray-600">{profile?.name}</p>
              </div>
              <div>
                <Label>Phone Number</Label>
                <p className="text-gray-600">{profile?.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Notifications</span>
                    <span className="text-gray-600">{profile?.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SMS Notifications</span>
                    <span className="text-gray-600">{profile?.preferences?.smsNotifications ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Marketing Emails</span>
                    <span className="text-gray-600">{profile?.preferences?.marketingEmails ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reminder Time</span>
                    <span className="text-gray-600">{profile?.preferences?.reminderTime || 24} hours before</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 