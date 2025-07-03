import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()
    
    console.log('🐛 DEBUG: Starting auth debug...')
    console.log('📧 Email:', email)
    console.log('🔑 Password length:', password?.length)
    console.log('🏷️ Role:', role)
    
    // Exact same validation as auth.ts
    if (!email || !password) {
      console.log('❌ Missing credentials')
      return NextResponse.json({ 
        success: false, 
        error: 'Missing credentials',
        details: { email: !!email, password: !!password }
      })
    }

    console.log('🔍 Attempting login validation...')

    if (role === 'ADMIN') {
      console.log('🔑 Admin login path...')
      
      try {
        const admin = await prisma.systemAdmin.findUnique({
          where: { email }
        })

        console.log('👤 Admin found:', !!admin)
        
        if (admin) {
          console.log('📊 Admin details:', {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            hashLength: admin.passwordHash?.length
          })
          
          console.log('🔒 Comparing password...')
          const passwordMatch = await compare(password, admin.passwordHash)
          console.log('🔐 Password match:', passwordMatch)
          
          if (passwordMatch) {
            console.log('✅ Admin auth would succeed')
            const userObject = {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: 'ADMIN',
              staffRole: admin.role,
              permissions: ['canViewAll', 'canManageBusinesses', 'canManageUsers']
            }
            
            return NextResponse.json({ 
              success: true,
              message: 'Authentication would succeed',
              user: userObject
            })
          } else {
            console.log('❌ Password mismatch')
            return NextResponse.json({ 
              success: false, 
              error: 'Password mismatch' 
            })
          }
        } else {
          console.log('❌ Admin not found')
          return NextResponse.json({ 
            success: false, 
            error: 'Admin not found' 
          })
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError)
        return NextResponse.json({ 
          success: false, 
          error: 'Database error',
          details: dbError instanceof Error ? dbError.message : 'Unknown DB error'
        })
      }
    } else {
      console.log('👥 Non-admin login path...')
      return NextResponse.json({ 
        success: false, 
        error: 'Non-admin login not implemented in debug' 
      })
    }
    
  } catch (error) {
    console.error('❌ Debug auth error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 