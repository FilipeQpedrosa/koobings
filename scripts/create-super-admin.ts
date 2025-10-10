import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSuperAdmin() {
  try {
    console.log('🔍 Checking database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    console.log('🔍 Checking if super admin already exists...')
    
    // Check if super admin already exists
    const existingAdmin = await prisma.system_admins.findFirst({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    if (existingAdmin) {
      console.log('⚠️  Super admin already exists!')
      console.log(`📧 Email: ${existingAdmin.email}`)
      console.log(`👤 Name: ${existingAdmin.name}`)
      console.log(`🔑 Role: ${existingAdmin.role}`)
      return
    }
    
    console.log('🔑 Creating super admin...')
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create the super admin
    const admin = await prisma.system_admins.create({
      data: {
        id: 'admin-' + Date.now(),
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      },
    })
    
    console.log('🎉 Super admin created successfully!')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`👤 Name: ${admin.name}`)
    console.log(`🔑 Role: ${admin.role}`)
    console.log(`🔒 Password: admin123`)
    console.log(`🔗 Login URL: https://koobings.com/auth/admin-signin`)
    
  } catch (error: any) {
    console.error('❌ Error creating super admin:', error)
    
    if (error.code === 'P2002') {
      console.log('⚠️  User already exists with this email')
    } else if (error.code === 'P1001') {
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
createSuperAdmin() 