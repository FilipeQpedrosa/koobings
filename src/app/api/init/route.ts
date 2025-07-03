import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Check if any admin already exists
    const existingAdmin = await prisma.systemAdmin.findFirst();
    
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'ALREADY_INITIALIZED', 
          message: 'Database already has admin users. Use the admin panel to manage users.' 
        } 
      }, { status: 400 });
    }

    // Create the system admin (your account)
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.systemAdmin.create({
      data: {
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword,
      },
    });

    // Also create the default admin from seed
    const defaultAdminPassword = await bcrypt.hash('admin123', 12);
    const defaultAdmin = await prisma.systemAdmin.create({
      data: {
        email: 'admin@example.com',
        name: 'System Admin',
        role: 'SUPER_ADMIN',
        passwordHash: defaultAdminPassword,
      },
    });

    // Create a business owner example (Sandra from the seed)
    const sandraPassword = await bcrypt.hash('admin123', 12);
    const sandra = await prisma.systemAdmin.create({
      data: {
        email: 'sandra@gmail.com',
        name: 'Sandra Silva',
        role: 'ADMIN',
        passwordHash: sandraPassword,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        message: 'Database initialized successfully! You can now log in as admin.',
        admins: [
          { email: admin.email, name: admin.name, password: 'admin123', role: 'SUPER_ADMIN' },
          { email: defaultAdmin.email, name: defaultAdmin.name, password: 'admin123', role: 'SUPER_ADMIN' },
          { email: sandra.email, name: sandra.name, password: 'admin123', role: 'ADMIN' }
        ],
        loginUrl: `${process.env.NEXTAUTH_URL || 'https://service-scheduler-luzzmob8z-filipe-pedrosas-projects.vercel.app'}/auth/admin-signin`
      }
    });

  } catch (error: any) {
    console.error('Database initialization error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'DUPLICATE_ADMIN', 
          message: 'Admin user already exists with this email' 
        } 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'SETUP_ERROR', 
        message: 'Failed to initialize database. This might be due to missing database tables. Please ensure the database schema is deployed.' 
      } 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 