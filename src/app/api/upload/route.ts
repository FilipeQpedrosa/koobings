import { NextResponse, NextRequest } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { put } from '@vercel/blob';

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
    console.log('📤 [UPLOAD] Starting file upload to Vercel Blob...');
    
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

    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('📋 [UPLOAD] FormData parsed successfully');
    } catch (error) {
      console.error('❌ [UPLOAD] Failed to parse FormData:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_FORM_DATA', message: 'Failed to parse form data' } },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'general'; // 'logo', 'avatar', 'general'

    console.log('📁 [UPLOAD] File from FormData:', {
      file: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      uploadType
    });

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

    console.log('📁 [UPLOAD] File details validated:', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadType
    });

    // Generate unique filename with proper structure
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileName = `${uploadType}/${timestamp}-${randomId}.${fileExtension}`;
    
    console.log('📝 [UPLOAD] Generated filename:', fileName);

    try {
      // Upload to Vercel Blob
      console.log('☁️ [UPLOAD] Uploading to Vercel Blob...');
      
      const blob = await put(fileName, file, {
        access: 'public',
      });
      
      console.log('✅ [UPLOAD] File uploaded successfully to Vercel Blob:', blob.url);
      
      return NextResponse.json({
        success: true,
        data: {
          url: blob.url,
          fileName: blob.pathname,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadType,
          downloadUrl: blob.downloadUrl
        }
      });

    } catch (blobError: any) {
      console.error('❌ [UPLOAD] Failed to upload to Vercel Blob:', {
        message: blobError.message,
        stack: blobError.stack,
        name: blobError.name
      });
      return NextResponse.json(
        { success: false, error: { code: 'BLOB_UPLOAD_ERROR', message: `Failed to upload to cloud storage: ${blobError.message}` } },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ [UPLOAD] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { success: false, error: { code: 'UPLOAD_ERROR', message: `Upload failed: ${error.message}` } },
      { status: 500 }
    );
  }
} 