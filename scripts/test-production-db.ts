import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const DATABASE_URL = "postgres://postgres.yicrpxgomfxmxnakdnkk:TexvICfOjtKzzmaj@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"

async function testProductionDB() {
  console.log('🔗 Testing production database connection...')
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  })

  try {
    // Test connection
    console.log('🔍 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Test admin user
    console.log('🔍 Looking for admin user...')
    const admin = await prisma.systemAdmin.findFirst({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })

    if (!admin) {
      console.log('❌ Admin user not found!')
      return
    }

    console.log('✅ Admin user found:', {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name
    })

    // Test password
    console.log('🔐 Testing password...')
    const passwordMatch = await bcrypt.compare('admin123', admin.passwordHash)
    console.log('🔐 Password match:', passwordMatch)

    if (passwordMatch) {
      console.log('🎉 TUDO FUNCIONA PERFEITAMENTE!')
    } else {
      console.log('❌ Password does not match')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProductionDB() 