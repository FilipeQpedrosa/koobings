import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.systemAdmin.findFirst();
    
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'ALREADY_INITIALIZED', 
          message: 'Database already initialized with admin user' 
        } 
      }, { status: 400 });
    }

    // Create the system admin
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

    return NextResponse.json({ 
      success: true, 
      data: {
        message: 'Database initialized successfully',
        admins: [
          { email: admin.email, name: admin.name, password: 'admin123' },
          { email: defaultAdmin.email, name: defaultAdmin.name, password: 'admin123' }
        ]
      }
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'SETUP_ERROR', 
        message: 'Failed to initialize database' 
      } 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 