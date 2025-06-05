import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';
import { Business, Staff, Prisma, DataAccessType } from "@prisma/client";
import type { UserRole } from '@/types/dashboard';

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string;
  lastLogin?: Date;
  permissions?: string[];
  staffRole?: string;
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
        const staffEmail = credentials.email.toLowerCase();
        const staff = await prisma.staff.findUnique({
          where: { email: staffEmail },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            businessId: true,
            permissions: { select: { resource: true } },
          },
        });

        if (staff) {
          const isPasswordValid = await compare(credentials.password, staff.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          const user: CustomUser = {
            id: staff.id,
            email: staff.email,
            name: staff.name,
            role: 'STAFF',
            staffRole: staff.role,
            businessId: staff.businessId,
            lastLogin: new Date(),
            permissions: Array.isArray(staff.permissions) ? staff.permissions.map((p: { resource: string }) => p.resource) : [],
          };

          return user;
        }

        // If not staff, try business owner
        const businessEmail = credentials.email.toLowerCase();
        const business = await prisma.business.findUnique({
          where: { email: businessEmail }
        });

        if (business) {
          const isPasswordValid = await compare(credentials.password, business.passwordHash);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          const user: CustomUser = {
            id: business.id,
            email: business.email,
            name: business.name,
            role: 'BUSINESS_OWNER',
            businessId: business.id,
            lastLogin: new Date(),
            permissions: ['business_admin']
          };

          return user;
        }

        // If not business, try system admin
        const adminEmail = credentials.email.toLowerCase();
        const admin = await prisma.systemAdmin.findUnique({
          where: { email: adminEmail }
        });

        if (admin) {
          const isPasswordValid = await compare(credentials.password, admin.passwordHash);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          const user: CustomUser = {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'ADMIN',
            lastLogin: new Date(),
            permissions: ['admin']
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
        const merged = { ...token, ...user };
        if (process.env.NODE_ENV === 'development') {
          console.log('[NextAuth][jwt callback][MERGED]', merged);
        }
        return merged;
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth][jwt callback][NO USER]', token);
      }
      return token;
    },
    async session({ session, token }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth][session callback] session:', session, 'token:', token);
      }
      session.user = token as CustomUser;
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      const customUser = user as CustomUser;
      const isStaff = customUser.role === 'STAFF';
      const dummyClientId = await getDummyClientId(customUser.businessId || customUser.id);

      // Log successful sign-in
      await prisma.dataAccessLog.create({
        data: {
          businessId: isStaff ? customUser.businessId! : customUser.id,
          staffId: isStaff ? customUser.id : await getDummyStaffId(customUser.id),
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
        const isStaff = token.role === 'STAFF';
        const dummyClientId = await getDummyClientId(token.businessId || token.id);

        // Log sign-out
        await prisma.dataAccessLog.create({
          data: {
            businessId: isStaff ? token.businessId! : token.id,
            staffId: isStaff ? token.id : await getDummyStaffId(token.id),
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

// Helper function to get or create a dummy client for system logs
async function getDummyClientId(businessId: string): Promise<string> {
  const dummyClient = await prisma.client.findFirst({
    where: { email: 'system@scheduler.local', businessId }
  });

  if (dummyClient) {
    return dummyClient.id;
  }

  // Use upsert to avoid unique constraint errors (unique on email only)
  const newDummyClient = await prisma.client.upsert({
    where: { email: 'system@scheduler.local' },
    update: {},
    create: {
      name: 'System',
      email: 'system@scheduler.local',
      businessId,
      status: 'ACTIVE',
      isDeleted: false,
    }
  });

  return newDummyClient.id;
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