import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '../src/generated/prisma'
import testEnv from '../vitest.env'

// Use environment variables from test config
Object.assign(process.env, testEnv)

async function setupTestEnvironment() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey?.substring(0, 10) + '...')
    console.log('TEST_USER_EMAIL:', process.env.TEST_USER_EMAIL)

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required environment variables')
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to sign in, if that fails, create a new user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    })

    if (signInError) {
      // If sign in fails, try to create a new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: process.env.TEST_USER_EMAIL!,
        password: process.env.TEST_USER_PASSWORD!,
      })

      if (signUpError) {
        console.error('Error creating test user:', signUpError)
        return
      }

      console.log('Test user created:', signUpData)
    } else {
      console.log('Test user signed in:', signInData)
    }

    // Initialize Prisma client
    const prisma = new PrismaClient()

    // Create test business
    const business = await prisma.business.create({
      data: {
        name: 'Test Business',
        email: process.env.TEST_USER_EMAIL!,
        type: 'OTHER',
      },
    })

    console.log('Test business created:', business)

    // Create test staff
    const staff = await prisma.staff.create({
      data: {
        name: 'Test Staff',
        email: process.env.TEST_USER_EMAIL!,
        role: 'OWNER',
        business: { connect: { id: business.id } },
      },
    })

    console.log('Test staff created:', staff)

    // Create test client
    const client = await prisma.client.create({
      data: {
        name: 'Test Client',
        phone: '1234567890',
        business: { connect: { id: business.id } },
      },
    })

    console.log('Test client created:', client)

    await prisma.$disconnect()
    console.log('Test environment setup completed successfully!')
  } catch (error) {
    console.error('Error setting up test environment:', error)
    process.exit(1)
  }
}

setupTestEnvironment() 