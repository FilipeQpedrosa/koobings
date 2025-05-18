'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  maxSize: number;
  accept: string;
}

export function ImageUpload({ value, onChange, maxSize, accept }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your storage service (e.g., S3, Cloudinary)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        ref={fileInputRef}
      />

      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Uploaded image"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 