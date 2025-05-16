import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';
import { Business, Staff, Prisma, DataAccessType } from "@prisma/client";

export type UserRole = 'staff' | 'business';

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string;
  lastLogin?: Date;
  permissions?: string[];
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
  interface User extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser {}
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        // Try to find staff member first
        const staff = await prisma.staff.findUnique({
          where: { email: credentials.email },
          include: {
            permissions: true
          }
        });

        if (staff) {
          const isPasswordValid = await compare(credentials.password, staff.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Check if MFA is required
          if (staff.mfaEnabled) {
            // In a real implementation, you would handle MFA here
            // For now, we'll just pass through
          }

          // Update last active
          await prisma.staff.update({
            where: { id: staff.id },
            data: { lastActive: new Date() }
          });

          const user: CustomUser = {
            id: staff.id,
            email: staff.email,
            name: staff.name,
            role: 'staff',
            businessId: staff.businessId,
            lastLogin: new Date(),
            permissions: staff.permissions.map(p => p.resource)
          };

          return user;
        }

        // If not staff, try business owner
        const business = await prisma.business.findUnique({
          where: { email: credentials.email },
          include: {
            securitySettings: true
          }
        });

        if (business) {
          // Check business status
          if (business.status !== 'ACTIVE') {
            throw new Error('Business account is not active');
          }

          // For now, we'll store the password in the settings JSON field
          const settings = business.settings as { password?: string };
          const isPasswordValid = settings.password ? await compare(credentials.password, settings.password) : false;
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Check security settings
          if (business.securitySettings?.requireMFA) {
            // In a real implementation, you would handle MFA here
            // For now, we'll just pass through
          }

          const user: CustomUser = {
            id: business.id,
            email: business.email,
            name: business.name,
            role: 'business',
            lastLogin: new Date(),
            permissions: ['business_admin']
          };

          return user;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as CustomUser;
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      const customUser = user as CustomUser;
      const isStaff = customUser.role === 'staff';
      const dummyPatientId = await getDummyPatientId();

      // Log successful sign-in
      await prisma.dataAccessLog.create({
        data: {
          businessId: isStaff ? customUser.businessId! : customUser.id,
          staffId: isStaff ? customUser.id : await getDummyStaffId(customUser.id),
          patientId: dummyPatientId,
          accessType: DataAccessType.VIEW,
          resource: 'auth',
          reason: 'User sign in',
          successful: true,
          timestamp: new Date()
        }
      });
    },
    async signOut({ token }) {
      if (token) {
        const isStaff = token.role === 'staff';
        const dummyPatientId = await getDummyPatientId();

        // Log sign-out
        await prisma.dataAccessLog.create({
          data: {
            businessId: isStaff ? token.businessId! : token.id,
            staffId: isStaff ? token.id : await getDummyStaffId(token.id),
            patientId: dummyPatientId,
            accessType: DataAccessType.VIEW,
            resource: 'auth',
            reason: 'User sign out',
            successful: true,
            timestamp: new Date()
          }
        });
      }
    }
  }
};

// Helper function to get or create a dummy patient for system logs
async function getDummyPatientId(): Promise<string> {
  const dummyPatient = await prisma.patient.findFirst({
    where: { email: 'system@scheduler.local' }
  });

  if (dummyPatient) {
    return dummyPatient.id;
  }

  const newDummyPatient = await prisma.patient.create({
    data: {
      email: 'system@scheduler.local',
      name: 'System',
      status: 'ACTIVE'
    }
  });

  return newDummyPatient.id;
}

// Helper function to get or create a dummy staff for business owner logs
async function getDummyStaffId(businessId: string): Promise<string> {
  const dummyStaff = await prisma.staff.findFirst({
    where: {
      email: 'system@scheduler.local',
      businessId
    }
  });

  if (dummyStaff) {
    return dummyStaff.id;
  }

  const newDummyStaff = await prisma.staff.create({
    data: {
      email: 'system@scheduler.local',
      name: 'System',
      password: 'not-applicable',
      role: 'ADMIN',
      businessId
    }
  });

  return newDummyStaff.id;
} 