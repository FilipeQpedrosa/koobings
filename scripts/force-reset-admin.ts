import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function forceResetAdmin() {
  try {
    console.log('🔍 Connecting to production database...')
    
    await prisma.$connect()
    console.log('✅ Connected to production database')
    
    console.log('🔍 Finding admin user...')
    
    const admin = await prisma.system_admins.findFirst({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    if (!admin) {
      console.log('❌ Admin not found, creating new one...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
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
      
      console.log('✅ New admin created!')
      console.log('📧 Email:', newAdmin.email)
      console.log('🔒 Password: admin123')
      
    } else {
      console.log('👤 Admin found:', admin.name)
      
      console.log('🔒 Force resetting password...')
      const newHash = await bcrypt.hash('admin123', 12)
      
      const updatedAdmin = await prisma.system_admins.update({
        where: { id: admin.id },
        data: {
          passwordHash: newHash,
          updatedAt: new Date(),
        },
      })
      
      console.log('✅ Password force reset!')
      console.log('📧 Email:', updatedAdmin.email)
      console.log('🔒 New Password: admin123')
      
      // Test the new password
      const isValid = await bcrypt.compare('admin123', newHash)
      console.log('✅ Password test:', isValid)
    }
    
    console.log('\n🔗 Login URL: https://koobings.com/auth/admin-signin')
    console.log('📧 Email: f.queirozpedrosa@gmail.com')
    console.log('🔒 Password: admin123')
    
  } catch (error: any) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

forceResetAdmin()
