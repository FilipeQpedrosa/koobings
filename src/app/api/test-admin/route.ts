import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 Test admin auth for:', email)
    
    // Find admin - using correct model name
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    })
    
    console.log('👤 Admin found:', !!admin)
    if (admin) {
      console.log('🏷️ Admin role:', admin.role)
      console.log('📧 Admin email:', admin.email)
      console.log('👤 Admin name:', admin.name)
    }
    
    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin not found',
        email 
      }, { status: 404 })
    }
    
    // Check password
    const passwordMatch = await compare(password, admin.passwordHash)
    console.log('🔐 Password match:', passwordMatch)
    
    if (!passwordMatch) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid password' 
      }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true, 
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
    
  } catch (error) {
    console.error('❌ Test admin error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 