'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  maxSize?: number;
  accept?: string;
  uploadType?: 'logo' | 'avatar' | 'general';
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ImageUpload({ 
  value, 
  onChange, 
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/*',
  uploadType = 'general',
  className,
  placeholder = 'Upload Image',
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      console.log('📤 [ImageUpload] Uploading file:', file.name);
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('✅ [ImageUpload] Upload successful:', data.data.url);
      
      onChange(data.data.url);
    } catch (error) {
      console.error('❌ [ImageUpload] Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        ref={fileInputRef}
        disabled={disabled || isUploading}
      />

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          value && "border-solid border-green-500"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {value ? (
          <div className="relative">
            <div className="flex items-center justify-center">
              <img
                src={value}
                alt="Uploaded image"
                className="max-w-full max-h-48 object-contain rounded-lg"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Image className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
                <p className="text-xs text-gray-500">
                  Drag and drop or click to select
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max size: {maxSize / (1024 * 1024)}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
} 