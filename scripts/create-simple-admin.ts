import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSimpleAdmin() {
  try {
    console.log('🔍 Connecting to production database...')
    
    await prisma.$connect()
    console.log('✅ Connected to production database')
    
    // Delete all existing admins
    console.log('🗑️ Deleting all existing admins...')
    await prisma.system_admins.deleteMany({})
    
    console.log('🔑 Creating simple admin...')
    const simplePassword = '123456'
    const hashedPassword = await bcrypt.hash(simplePassword, 10) // Lower rounds for compatibility
    
    const newAdmin = await prisma.system_admins.create({
      data: {
        id: 'admin-simple-' + Date.now(),
        email: 'admin@koobings.com',
        name: 'Admin',
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      },
    })
    
    console.log('✅ Simple admin created!')
    console.log('📧 Email:', newAdmin.email)
    console.log('🔒 Password:', simplePassword)
    
    // Test the password
    const isValid = await bcrypt.compare(simplePassword, hashedPassword)
    console.log('✅ Password test:', isValid)
    
    console.log('\n🔗 Login URL: https://koobings.com/auth/admin-signin')
    console.log('📧 Email: admin@koobings.com')
    console.log('🔒 Password: 123456')
    
  } catch (error: any) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSimpleAdmin()
