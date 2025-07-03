import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔍 Testing admin login logic...')
    
    const email = 'f.queirozpedrosa@gmail.com'
    const password = 'admin123'
    
    console.log('🔑 Looking for admin with email:', email)
    
    const admin = await prisma.systemAdmin.findUnique({
      where: { email }
    })
    
    if (!admin) {
      console.log('❌ Admin not found!')
      return
    }
    
    console.log('✅ Admin found!')
    console.log('📧 Email:', admin.email)
    console.log('👤 Name:', admin.name)
    console.log('🏷️ Role:', admin.role)
    console.log('🔑 Password hash length:', admin.passwordHash.length)
    
    console.log('🔒 Testing password...')
    const passwordMatch = await bcrypt.compare(password, admin.passwordHash)
    console.log('🔐 Password match:', passwordMatch)
    
    if (passwordMatch) {
      console.log('🎉 LOGIN TEST SUCCESSFUL!')
      console.log('Admin object that would be returned:')
      console.log({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'ADMIN',
        staffRole: admin.role,
        permissions: ['canViewAll', 'canManageBusinesses', 'canManageUsers']
      })
    } else {
      console.log('❌ LOGIN TEST FAILED - PASSWORD MISMATCH')
    }
    
  } catch (error) {
    console.error('❌ Test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin() 