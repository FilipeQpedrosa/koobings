import { NextResponse } from 'next/server'
import { compare } from "bcryptjs";
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()
    
    console.log('🔍 NextAuth debug - credentials check...')
    
    if (!email || !password) {
      console.log('❌ Missing credentials:', { email: !!email, password: !!password });
      return NextResponse.json({ success: false, error: 'Missing credentials' })
    }

    console.log('🔍 Attempting login:', { email, role });

    // Check if it's an admin login
    if (role === 'ADMIN') {
      console.log('🔑 Admin login attempt for:', email);
      
      try {
        const admin = await prisma.systemAdmin.findUnique({
          where: { email }
        });

        console.log('👤 Admin found:', !!admin);
        
        if (admin) {
          console.log('🔒 Comparing password...');
          console.log('🏷️ Admin role in DB:', admin.role);
          const passwordMatch = await compare(password, admin.passwordHash);
          console.log('🔐 Password match:', passwordMatch);
          
          if (passwordMatch) {
            console.log('✅ Admin login successful');
            const userObj = {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: 'ADMIN',
              staffRole: admin.role,
              permissions: ['canViewAll', 'canManageBusinesses', 'canManageUsers']
            };
            
            return NextResponse.json({ 
              success: true,
              message: 'Login would succeed',
              user: userObj
            })
          } else {
            console.log('❌ Password mismatch for admin');
            return NextResponse.json({ success: false, error: 'Password mismatch' })
          }
        } else {
          console.log('❌ Admin not found with email:', email);
          return NextResponse.json({ success: false, error: 'Admin not found' })
        }
      } catch (dbError) {
        console.error('❌ Database error during admin lookup:', dbError);
        return NextResponse.json({ 
          success: false, 
          error: 'Database error', 
          details: dbError instanceof Error ? dbError.message : String(dbError)
        })
      }
    } else {
      return NextResponse.json({ success: false, error: 'Non-admin not implemented' })
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Request error', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 