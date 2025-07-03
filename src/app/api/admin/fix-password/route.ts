import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { adminSecret, email, newPassword } = await request.json()
    
    // Security check - require admin secret from env
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔧 Admin password fix requested for:', email)
    
    // Find admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email }
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    
    // Generate new hash
    const newPasswordHash = await bcrypt.hash(newPassword, 12)
    
    // Update password
    await prisma.systemAdmin.update({
      where: { email },
      data: { passwordHash: newPasswordHash }
    })
    
    // Test the new password
    const testMatch = await bcrypt.compare(newPassword, newPasswordHash)
    
    console.log('✅ Password fixed successfully for:', email)
    
    return NextResponse.json({ 
      success: true,
      passwordTest: testMatch,
      message: 'Password updated successfully'
    })
    
  } catch (error) {
    console.error('❌ Password fix error:', error)
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 