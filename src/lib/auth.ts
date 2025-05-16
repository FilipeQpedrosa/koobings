import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';

export type UserRole = 'staff' | 'business';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string;
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: User;
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    businessId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    businessId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
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
          return null;
        }

        // Try to find staff member first
        const staff = await prisma.staff.findUnique({
          where: { email: credentials.email }
        });

        if (staff) {
          const isPasswordValid = await compare(credentials.password, staff.password);
          if (isPasswordValid) {
            return {
              id: staff.id,
              email: staff.email,
              name: staff.name,
              role: 'staff' as const,
              businessId: staff.businessId
            };
          }
        }

        // If not staff, try business owner
        const business = await prisma.business.findUnique({
          where: { email: credentials.email }
        });

        if (business) {
          const isPasswordValid = await compare(credentials.password, business.password);
          if (isPasswordValid) {
            return {
              id: business.id,
              email: business.email,
              name: business.name,
              role: 'business' as const
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        if (user.businessId) {
          token.businessId = user.businessId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        ...(token.businessId && { businessId: token.businessId })
      };
      return session;
    }
  }
}; 