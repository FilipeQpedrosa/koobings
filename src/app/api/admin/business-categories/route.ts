import { NextRequest, NextResponse } from 'next/server';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2';
import { logSecurityEvent } from '@/lib/security-monitoring';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🏪 Current business categories (from Prisma enum)
const CURRENT_CATEGORIES = [
  { key: 'HAIR_SALON', name: 'Cabeleireiro', description: 'Salões de cabeleireiro e beleza', color: '#8B5CF6' },
  { key: 'BARBERSHOP', name: 'Barbearia', description: 'Barbearias masculinas', color: '#6366F1' },
  { key: 'NAIL_SALON', name: 'Manicure/Pedicure', description: 'Salões de unhas e estética', color: '#EC4899' },
  { key: 'PHYSIOTHERAPY', name: 'Fisioterapia', description: 'Clínicas de fisioterapia', color: '#10B981' },
  { key: 'PSYCHOLOGY', name: 'Psicologia', description: 'Consultas de psicologia', color: '#F59E0B' },
  { key: 'OTHER', name: 'Outro', description: 'Outros tipos de negócio', color: '#6B7280' }
];

// 🆕 Additional category suggestions
const SUGGESTED_CATEGORIES = [
  { key: 'DENTISTRY', name: 'Dentista', description: 'Clínicas dentárias', color: '#06B6D4' },
  { key: 'VETERINARY', name: 'Veterinário', description: 'Clínicas veterinárias', color: '#84CC16' },
  { key: 'BEAUTY_CLINIC', name: 'Clínica de Estética', description: 'Tratamentos estéticos avançados', color: '#F472B6' },
  { key: 'MASSAGE', name: 'Massagens', description: 'Terapias de massagem', color: '#A78BFA' },
  { key: 'FITNESS', name: 'Personal Trainer', description: 'Treino personalizado', color: '#EF4444' },
  { key: 'NUTRITION', name: 'Nutricionista', description: 'Consultas de nutrição', color: '#22C55E' },
  { key: 'TATTOO', name: 'Tatuagens', description: 'Estúdios de tatuagem', color: '#374151' },
  { key: 'SPA', name: 'SPA', description: 'Centros de bem-estar', color: '#14B8A6' },
  { key: 'CONSULTING', name: 'Consultoria', description: 'Serviços de consultoria', color: '#3B82F6' },
  { key: 'EDUCATION', name: 'Educação', description: 'Aulas particulares e formação', color: '#F97316' }
];

// GET /api/admin/business-categories - List all categories
export async function GET(request: NextRequest) {
  try {
    console.log('[BUSINESS_CATEGORIES] 🏪 Admin fetching business categories...');

    // 🔒 ULTRA-SECURE: Verify admin session
    const session = verifyUltraSecureSessionV2(request);
    if (!session || session.role !== 'ADMIN') {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'HIGH', {
        reason: 'Non-admin accessing business categories'
      });
      
      const response = NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Acesso apenas para administradores' },
        { status: 403 }
      );
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      return response;
    }

    console.log(`[BUSINESS_CATEGORIES] ✅ Admin access: ${session.email}`);

    const response = NextResponse.json({
      success: true,
      data: {
        current: CURRENT_CATEGORIES,
        suggested: SUGGESTED_CATEGORIES,
        total: CURRENT_CATEGORIES.length + SUGGESTED_CATEGORIES.length
      },
      message: 'Categorias carregadas com sucesso',
      timestamp: new Date().toISOString()
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('[BUSINESS_CATEGORIES] ❌ Error fetching categories:', error);
    
    const response = NextResponse.json(
      { success: false, error: 'CATEGORIES_FETCH_ERROR', message: 'Erro ao carregar categorias' },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
}

// POST /api/admin/business-categories - Add new category (for future implementation)
export async function POST(request: NextRequest) {
  try {
    console.log('[BUSINESS_CATEGORIES] 🆕 Admin adding new business category...');

    // 🔒 ULTRA-SECURE: Verify admin session
    const session = verifyUltraSecureSessionV2(request);
    if (!session || session.role !== 'ADMIN') {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'HIGH', {
        reason: 'Non-admin attempting to add business category'
      });
      
      const response = NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Acesso apenas para administradores' },
        { status: 403 }
      );
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      return response;
    }

    const { name, description, color } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'INVALID_DATA', message: 'Nome e descrição são obrigatórios' },
        { status: 400 }
      );
    }

    // TODO: In future, add to database and update Prisma enum
    console.log(`[BUSINESS_CATEGORIES] 📝 New category request: ${name} by ${session.email}`);

    // Log as successful login to track admin actions
    logSecurityEvent('LOGIN_SUCCESS', request, 'MEDIUM', {
      action: 'ADD_BUSINESS_CATEGORY',
      categoryName: name,
      adminEmail: session.email
    });

    const response = NextResponse.json({
      success: true,
      message: 'Categoria adicionada com sucesso (implementação futura)',
      data: { name, description, color },
      timestamp: new Date().toISOString()
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;

  } catch (error) {
    console.error('[BUSINESS_CATEGORIES] ❌ Error adding category:', error);
    
    const response = NextResponse.json(
      { success: false, error: 'CATEGORY_ADD_ERROR', message: 'Erro ao adicionar categoria' },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
} 