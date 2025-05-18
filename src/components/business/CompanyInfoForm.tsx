'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

interface CompanyInfo {
  description: string;
  logo: string | null;
  coverImage: string | null;
  phone: string;
  address: string;
  socialLinks: {
    website: string;
    facebook: string;
    instagram: string;
  };
}

const DEFAULT_INFO: CompanyInfo = {
  description: '',
  logo: null,
  coverImage: null,
  phone: '',
  address: '',
  socialLinks: {
    website: '',
    facebook: '',
    instagram: '',
  },
};

export default function CompanyInfoForm() {
  const { toast } = useToast();
  const [info, setInfo] = useState<CompanyInfo>(DEFAULT_INFO);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    setInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform: keyof CompanyInfo['socialLinks'], value: string) => {
    setInfo((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/business/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });

      if (!response.ok) {
        throw new Error('Failed to save company information');
      }

      toast({
        title: 'Success',
        description: 'Company information saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save company information',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        Tell us more about your business. This information will be displayed to your customers.
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-2">
          <Label>Logo</Label>
          <ImageUpload
            value={info.logo}
            onChange={(url) => handleChange('logo', url)}
            maxSize={1024 * 1024} // 1MB
            accept="image/*"
          />
          <p className="text-sm text-gray-500">
            Upload your business logo. Recommended size: 200x200px. Max size: 1MB
          </p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label>Cover Image</Label>
          <ImageUpload
            value={info.coverImage}
            onChange={(url) => handleChange('coverImage', url)}
            maxSize={2 * 1024 * 1024} // 2MB
            accept="image/*"
          />
          <p className="text-sm text-gray-500">
            Upload a cover image for your business page. Recommended size: 1200x400px. Max size: 2MB
          </p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label htmlFor="description">Business Description</Label>
          <Textarea
            id="description"
            value={info.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Tell customers about your business..."
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={info.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={info.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Business St, City, State"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={info.socialLinks.website}
            onChange={(e) => handleSocialLinkChange('website', e.target.value)}
            placeholder="https://www.yourbusiness.com"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={info.socialLinks.facebook}
            onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yourbusiness"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={info.socialLinks.instagram}
            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yourbusiness"
          />
        </div>
      </div>
    </div>
  );
} 