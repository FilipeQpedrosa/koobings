import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessId?: string;
  staffRole?: string;
  permissions?: string[];
}

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
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if it's an admin login
          if (credentials.role === 'ADMIN') {
            const admin = await prisma.systemAdmin.findUnique({
              where: { email: credentials.email }
            });

            if (admin && await compare(credentials.password, admin.passwordHash)) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: 'ADMIN',
                staffRole: admin.role,
                permissions: ['canViewAll', 'canManageBusinesses', 'canManageUsers']
              };
            }
          } else {
            // Check staff/business owner login
            const staff = await prisma.staff.findUnique({
              where: { email: credentials.email },
              include: { business: true }
            });

            if (staff && await compare(credentials.password, staff.password)) {
              return {
                id: staff.id,
                email: staff.email,
                name: staff.name,
                role: 'STAFF',
                businessId: staff.businessId,
                staffRole: staff.role,
                permissions: staff.role === 'ADMIN' ? ['canManageBusiness'] : ['canViewSchedule']
              };
            }

            // Check business owner login
            const business = await prisma.business.findUnique({
              where: { email: credentials.email }
            });

            if (business && await compare(credentials.password, business.passwordHash)) {
              return {
                id: business.id,
                email: business.email,
                name: business.ownerName || business.name,
                role: 'BUSINESS_OWNER',
                businessId: business.id,
                staffRole: 'ADMIN',
                permissions: ['canManageBusiness', 'canManageStaff']
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
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
    },
    async redirect({ url, baseUrl }) {
      // Redirect admin users to admin dashboard
      if (url.includes('admin-signin') || url.includes('role=ADMIN')) {
        return `${baseUrl}/admin/dashboard`;
      }
      // Default redirect for other users
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
}; 