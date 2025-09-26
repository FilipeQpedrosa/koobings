const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing login logic...');
    
    const email = 'marigabiatti@hotmail.com';
    const password = 'mari123';
    
    // Find staff
    const staff = await prisma.staff.findUnique({
      where: { email },
      include: {
        Business: true
      }
    });
    
    if (!staff) {
      console.log('❌ Staff not found!');
      return;
    }
    
    console.log('✅ Staff found:', staff.name);
    console.log('🏢 Business:', staff.Business?.name);
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, staff.password);
    console.log('🔐 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password!');
      return;
    }
    
    // Create JWT token
    const JWT_SECRET = process.env.NEXTAUTH_SECRET;
    console.log('🔑 JWT_SECRET length:', JWT_SECRET?.length);
    
    const token = jwt.sign({
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: 'STAFF',
      businessId: staff.businessId,
      businessName: staff.Business?.name || '',
      businessSlug: staff.Business?.slug || 'staff',
      staffRole: staff.role,
      isAdmin: staff.role === 'ADMIN'
    }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ JWT token created successfully!');
    console.log('🎯 Token length:', token.length);
    
    // Test the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verification successful!');
    console.log('👤 Decoded user:', {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      businessSlug: decoded.businessSlug
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
