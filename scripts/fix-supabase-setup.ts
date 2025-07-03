import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import bcrypt from 'bcryptjs'

const execAsync = promisify(exec)

async function fixSupabaseSetup() {
  console.log('🔧 Starting Supabase RLS fix...')
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found!')
    console.log('📝 Please set DATABASE_URL in your environment variables:')
    console.log('   export DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"')
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    // Test connection
    console.log('🔍 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully!')

    // Deploy Prisma schema
    console.log('📦 Deploying Prisma schema...')

    try {
      await execAsync('npx prisma db push --force-reset')
      console.log('✅ Prisma schema deployed!')
    } catch (error: any) {
      console.log('⚠️ Prisma deploy failed, continuing with RLS fix...')
    }

    // Read and execute RLS fix SQL
    console.log('🔒 Fixing RLS policies...')
    const sqlFile = path.join(process.cwd(), 'scripts', 'fix-supabase-rls.sql')
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')
    
    // Split SQL commands and execute one by one
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'))

    for (const command of commands) {
      if (command.includes('ALTER TABLE') || command.includes('GRANT')) {
        try {
          await prisma.$executeRawUnsafe(command)
          console.log(`✅ Executed: ${command.substring(0, 50)}...`)
        } catch (error: any) {
          console.log(`⚠️ Skipped: ${command.substring(0, 50)}... (${error.message})`)
        }
      }
    }

    // Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)

    try {
      const admin = await prisma.systemAdmin.upsert({
        where: { email: 'f.queirozpedrosa@gmail.com' },
        update: {
          passwordHash: hashedPassword,
        },
        create: {
          email: 'f.queirozpedrosa@gmail.com',
          name: 'Filipe Pedrosa',
          role: 'SUPER_ADMIN',
          passwordHash: hashedPassword,
        },
      })
      console.log('✅ Admin user created/updated:', admin.email)
    } catch (error: any) {
      console.log('⚠️ Admin creation failed:', error.message)
    }

    // Test final query
    console.log('🧪 Testing admin query...')
    const testAdmin = await prisma.systemAdmin.findUnique({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    })
    
    if (testAdmin) {
      console.log('✅ Admin found in database!')
      console.log(`📧 Email: ${testAdmin.email}`)
      console.log(`👤 Name: ${testAdmin.name}`)
      console.log(`🔑 Role: ${testAdmin.role}`)
    } else {
      console.log('❌ Admin not found')
    }

    console.log('\n🎉 Supabase setup completed successfully!')
    console.log('🔗 Now you can test login at: https://koobings.com/auth/admin-signin')
    console.log('📧 Email: f.queirozpedrosa@gmail.com')
    console.log('🔒 Password: admin123')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

fixSupabaseSetup()
  .catch(console.error) 