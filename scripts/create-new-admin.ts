import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createNewAdmin() {
  try {
    console.log('🔍 Connecting to production database...')
    
    await prisma.$connect()
    console.log('✅ Connected to production database')
    
    // Delete existing admin
    console.log('🗑️ Deleting existing admin...')
    await prisma.system_admins.deleteMany({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    console.log('🔑 Creating new admin with fresh password...')
    const hashedPassword = await bcrypt.hash('koobings2025', 12)
    
    const newAdmin = await prisma.system_admins.create({
      data: {
        id: 'admin-' + Date.now(),
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      },
    })
    
    console.log('✅ New admin created successfully!')
    console.log('📧 Email:', newAdmin.email)
    console.log('👤 Name:', newAdmin.name)
    console.log('🔑 Role:', newAdmin.role)
    console.log('🔒 Password: koobings2025')
    
    // Test the password
    const isValid = await bcrypt.compare('koobings2025', hashedPassword)
    console.log('✅ Password test:', isValid)
    
    console.log('\n🔗 Login URL: https://koobings.com/auth/admin-signin')
    console.log('📧 Email: f.queirozpedrosa@gmail.com')
    console.log('🔒 Password: koobings2025')
    
  } catch (error: any) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createNewAdmin()
