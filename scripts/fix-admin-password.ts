import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin password...')
    
    const email = 'f.queirozpedrosa@gmail.com'
    const newPassword = 'admin123'
    
    // Generate new hash with salt rounds 12 (same as in auth.ts)
    console.log('🔒 Generating new password hash...')
    const newPasswordHash = await bcrypt.hash(newPassword, 12)
    console.log('✅ New hash generated, length:', newPasswordHash.length)
    
    // Update the admin password
    console.log('💾 Updating admin password in database...')
    const updatedAdmin = await prisma.systemAdmin.update({
      where: { email },
      data: { passwordHash: newPasswordHash }
    })
    
    console.log('✅ Password updated successfully!')
    
    // Test the new password
    console.log('🧪 Testing new password...')
    const testMatch = await bcrypt.compare(newPassword, newPasswordHash)
    console.log('🔐 Test result:', testMatch)
    
    if (testMatch) {
      console.log('🎉 PASSWORD FIX SUCCESSFUL!')
      console.log('📧 Admin email:', updatedAdmin.email)
      console.log('🔑 New password: admin123')
    } else {
      console.log('❌ Password fix failed!')
    }
    
  } catch (error) {
    console.error('❌ Fix error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminPassword() 