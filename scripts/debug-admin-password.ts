import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function debugAdminPassword() {
  try {
    console.log('🔍 Checking database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    console.log('🔍 Finding admin user...')
    
    // Find admin user
    const admin = await prisma.system_admins.findFirst({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    if (!admin) {
      console.log('❌ Admin not found!')
      return
    }
    
    console.log('👤 Admin found:', admin.name)
    console.log('📧 Email:', admin.email)
    console.log('🔑 Role:', admin.role)
    console.log('🔒 Password hash:', admin.passwordHash)
    
    // Test password comparison
    const testPassword = 'admin123'
    console.log('\n🧪 Testing password comparison...')
    console.log('🔑 Test password:', testPassword)
    
    const isValidPassword = await bcrypt.compare(testPassword, admin.passwordHash)
    console.log('✅ Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('\n🔧 Creating new password hash...')
      const newHash = await bcrypt.hash(testPassword, 12)
      console.log('🔒 New hash:', newHash)
      
      console.log('\n🧪 Testing new hash...')
      const isValidNewHash = await bcrypt.compare(testPassword, newHash)
      console.log('✅ New hash valid:', isValidNewHash)
      
      if (isValidNewHash) {
        console.log('\n💾 Updating admin password...')
        await prisma.system_admins.update({
          where: { id: admin.id },
          data: {
            passwordHash: newHash,
            updatedAt: new Date(),
          },
        })
        console.log('✅ Password updated successfully!')
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error debugging admin password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
debugAdminPassword()
