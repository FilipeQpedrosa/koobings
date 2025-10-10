import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testProductionAdmin() {
  try {
    console.log('🔍 Testing production database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    console.log('🔍 Finding admin user in production...')
    
    // Find admin user
    const admin = await prisma.system_admins.findFirst({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    if (!admin) {
      console.log('❌ Admin not found in production!')
      console.log('🔧 Creating admin in production...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const newAdmin = await prisma.system_admins.create({
        data: {
          id: 'admin-prod-' + Date.now(),
          email: 'f.queirozpedrosa@gmail.com',
          name: 'Filipe Pedrosa',
          role: 'SUPER_ADMIN',
          passwordHash: hashedPassword,
          updatedAt: new Date(),
        },
      })
      
      console.log('✅ Admin created in production!')
      console.log('📧 Email:', newAdmin.email)
      console.log('👤 Name:', newAdmin.name)
      console.log('🔑 Role:', newAdmin.role)
      console.log('🔒 Password: admin123')
      
    } else {
      console.log('👤 Admin found in production:', admin.name)
      console.log('📧 Email:', admin.email)
      console.log('🔑 Role:', admin.role)
      
      // Test password
      const testPassword = 'admin123'
      const isValidPassword = await bcrypt.compare(testPassword, admin.passwordHash)
      console.log('✅ Password valid:', isValidPassword)
      
      if (!isValidPassword) {
        console.log('🔧 Updating password in production...')
        const newHash = await bcrypt.hash(testPassword, 12)
        
        await prisma.system_admins.update({
          where: { id: admin.id },
          data: {
            passwordHash: newHash,
            updatedAt: new Date(),
          },
        })
        
        console.log('✅ Password updated in production!')
      }
    }
    
    console.log('\n🔗 Test login URL: https://koobings.com/auth/admin-signin')
    console.log('📧 Email: f.queirozpedrosa@gmail.com')
    console.log('🔒 Password: admin123')
    
  } catch (error: any) {
    console.error('❌ Error testing production admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
testProductionAdmin()
