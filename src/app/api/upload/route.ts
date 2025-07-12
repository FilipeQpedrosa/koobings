import { NextResponse, NextRequest } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

// Supported file types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    console.log('📤 [UPLOAD] Starting file upload...');
    
    // Check authentication
    const user = getRequestAuthUser(request);
    if (!user) {
      console.log('❌ [UPLOAD] Unauthorized - no user');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    console.log('👤 [UPLOAD] User:', user.email, 'Role:', user.role);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'general'; // 'logo', 'avatar', 'general'

    if (!file) {
      console.log('❌ [UPLOAD] No file provided');
      return NextResponse.json(
        { success: false, error: { code: 'NO_FILE', message: 'No file provided' } },
        { status: 400 }
      );
    }

    // Validate file type
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      console.log('❌ [UPLOAD] Unsupported file type:', file.type);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_FILE_TYPE', message: 'Unsupported file type. Please upload JPG, PNG, WebP, or GIF images.' } },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('❌ [UPLOAD] File too large:', file.size);
      return NextResponse.json(
        { success: false, error: { code: 'FILE_TOO_LARGE', message: 'File size must be less than 5MB' } },
        { status: 400 }
      );
    }

    console.log('📁 [UPLOAD] File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadType
    });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    
    // Create directory structure based on upload type and user
    const uploadDir = uploadType === 'logo' ? 'logos' : 
                     uploadType === 'avatar' ? 'avatars' : 'general';
    
    const relativePath = `uploads/${uploadDir}/${fileName}`;
    const fullPath = join(process.cwd(), 'public', relativePath);
    
    console.log('💾 [UPLOAD] Saving to:', fullPath);

    // Ensure directory exists
    const dir = join(process.cwd(), 'public', 'uploads', uploadDir);
    await mkdir(dir, { recursive: true });

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(fullPath, buffer);
    
    // Return public URL
    const publicUrl = `/${relativePath}`;
    
    console.log('✅ [UPLOAD] File uploaded successfully:', publicUrl);
    
    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadType
      }
    });

  } catch (error) {
    console.error('❌ [UPLOAD] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload file' } },
      { status: 500 }
    );
  }
} 