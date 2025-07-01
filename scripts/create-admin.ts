import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'f.queirozpedrosa@gmail.com'
  const password = 'Pipo1234'
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Create or update the admin
  const _admin = await prisma.systemAdmin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: 'System Admin'
    }
  })
  
  console.log('System admin created/updated successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 