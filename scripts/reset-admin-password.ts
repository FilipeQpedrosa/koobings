import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdminPassword() {
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
    console.log('🔑 Current role:', admin.role)
    
    console.log('🔒 Resetting password...')
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Update the admin password
    const updatedAdmin = await prisma.system_admins.update({
      where: { id: admin.id },
      data: {
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      },
    })
    
    console.log('🎉 Admin password reset successfully!')
    console.log(`📧 Email: ${updatedAdmin.email}`)
    console.log(`👤 Name: ${updatedAdmin.name}`)
    console.log(`🔑 Role: ${updatedAdmin.role}`)
    console.log(`🔒 New Password: admin123`)
    console.log(`🔗 Login URL: https://koobings.com/auth/admin-signin`)
    
  } catch (error: any) {
    console.error('❌ Error resetting admin password:', error)
    
    if (error.code === 'P1001') {
      console.log('❌ Cannot connect to database. Check your DATABASE_URL')
    } else if (error.code === 'P2021') {
      console.log('❌ Table does not exist. Run: npx prisma db push')
    } else {
      console.log('💡 Try running: npx prisma db push to create tables')
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
resetAdminPassword()
