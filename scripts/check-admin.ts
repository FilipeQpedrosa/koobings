import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user...')
    
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    if (admin) {
      console.log('✅ Admin found!')
      console.log('📧 Email:', admin.email)
      console.log('👤 Name:', admin.name)
      console.log('🔑 Role:', admin.role)
      console.log('🆔 ID:', admin.id)
      console.log('📅 Created:', admin.createdAt)
    } else {
      console.log('❌ Admin not found!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin() 