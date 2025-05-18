import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';
import { UserRole } from '@/types/dashboard';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error('Missing credentials');
        }

        let user;
        const role = credentials.role as UserRole;

        switch (role) {
          case 'BUSINESS_OWNER':
            user = await prisma.business.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                passwordHash: true,
              },
            });
            break;
          case 'STAFF':
            user = await prisma.staff.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                password: true,
                businessId: true,
              },
            });
            break;
          case 'CUSTOMER':
            user = await prisma.patient.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                passwordHash: true,
              },
            });
            break;
          default:
            throw new Error('Invalid role');
        }

        if (!user) {
          throw new Error('No user found');
        }

        const passwordMatch = await compare(
          credentials.password,
          role === 'STAFF' ? user.password : user.passwordHash
        );

        if (!passwordMatch) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: role,
          businessId: 'businessId' in user ? user.businessId : undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.businessId = user.businessId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as UserRole;
        session.user.businessId = token.businessId as string | undefined;
      }
      return session;
    },
  },
}; 