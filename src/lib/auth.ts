import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';
import { StaffRole } from "@prisma/client";

interface BaseUser {
  id: string;
  email: string;
  name: string;
}

interface StaffUser extends BaseUser {
  type: 'staff';
  role: StaffRole;
  businessId: string;
  businessName: string;
}

interface PatientUser extends BaseUser {
  type: 'patient';
}

type User = StaffUser | PatientUser;

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: User;
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    type: 'staff' | 'patient';
    role?: StaffRole;
    businessId?: string;
    businessName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    type: 'staff' | 'patient';
    role?: StaffRole;
    businessId?: string;
    businessName?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      id: 'patient-login',
      name: "Patient Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const patient = await prisma.patient.findUnique({
          where: { email: credentials.email },
          include: {
            sensitiveInfo: true
          }
        });

        if (!patient || !patient.sensitiveInfo?.notes) {
          return null;
        }

        // Extract password hash from notes
        const passwordHash = patient.sensitiveInfo.notes.replace('Password hash: ', '');
        const isPasswordValid = await compare(credentials.password, passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: patient.id,
          email: patient.email,
          name: patient.name,
          type: 'patient' as const
        };
      }
    }),
    CredentialsProvider({
      id: 'staff-login',
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const staff = await prisma.staff.findUnique({
          where: { email: credentials.email },
          include: {
            business: true
          }
        });

        if (!staff) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, staff.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          type: 'staff' as const,
          role: staff.role,
          businessId: staff.businessId,
          businessName: staff.business.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.type = user.type;
        if (user.type === 'staff') {
          token.role = user.role;
          token.businessId = user.businessId;
          token.businessName = user.businessName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        type: token.type,
        ...(token.type === 'staff' && {
          role: token.role,
          businessId: token.businessId,
          businessName: token.businessName
        })
      };
      return session;
    }
  }
}; 