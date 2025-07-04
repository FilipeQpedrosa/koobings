import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessId?: string;
  businessName?: string;
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
        console.log('🚀 NEXTAUTH AUTHORIZE CALLED');
        console.log('📥 Raw credentials received:', JSON.stringify(credentials, null, 2));
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials:', { email: !!credentials?.email, password: !!credentials?.password });
          console.log('❌ RETURNING NULL - Missing credentials');
          return null;
        }

        console.log('🔍 Attempting login:', { email: credentials.email, role: credentials.role });
        console.log('🔑 Password length:', credentials.password?.length);

        try {
          // Check if it's an admin login
          if (credentials.role === 'ADMIN') {
            console.log('🔑 Admin login attempt for:', credentials.email);
            
            try {
              console.log('🏗️ Creating Prisma connection...');
              const admin = await prisma.systemAdmin.findUnique({
                where: { email: credentials.email }
              });

              console.log('👤 Admin found:', !!admin);
              console.log('📊 Admin data:', admin ? {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                hashLength: admin.passwordHash?.length
              } : 'null');
              
              if (admin) {
                console.log('🔒 Comparing password...');
                console.log('🏷️ Admin role in DB:', admin.role);
                console.log('🔐 Hash to compare against:', admin.passwordHash?.substring(0, 10) + '...');
                
                const passwordMatch = await compare(credentials.password, admin.passwordHash);
                console.log('🔐 Password match result:', passwordMatch);
                
                if (passwordMatch) {
                  console.log('✅ Admin login successful');
                  const userObject = {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: 'ADMIN',
                    staffRole: admin.role,
                    permissions: ['canViewAll', 'canManageBusinesses', 'canManageUsers']
                  };
                  console.log('✅ RETURNING USER OBJECT:', JSON.stringify(userObject, null, 2));
                  return userObject;
                } else {
                  console.log('❌ Password mismatch for admin');
                  console.log('❌ RETURNING NULL - Password mismatch');
                  return null;
                }
              } else {
                console.log('❌ Admin not found with email:', credentials.email);
                console.log('❌ RETURNING NULL - Admin not found');
                return null;
              }
            } catch (dbError) {
              console.error('❌ Database error during admin lookup:', dbError);
              console.log('❌ RETURNING NULL - Database error');
              return null;
            }
          } else {
            console.log('🏢 Non-admin login attempt for:', credentials.email);
            
            // PRIORITY: Check staff/business owner login FIRST
            // This ensures business owners login as staff admins of their business
            console.log('👥 Checking staff table...');
            const staff = await prisma.staff.findUnique({
              where: { email: credentials.email },
              include: { business: true }
            });

            console.log('👤 Staff found:', !!staff);
            if (staff) {
              console.log('📊 Staff data:', {
                id: staff.id,
                email: staff.email,
                name: staff.name,
                role: staff.role,
                businessId: staff.businessId,
                businessName: staff.business?.name,
                passwordLength: staff.password?.length
              });
            }

            if (staff) {
              console.log('🔒 Comparing staff password...');
              const passwordMatch = await compare(credentials.password, staff.password);
              console.log('🔐 Staff password match:', passwordMatch);
              
              if (passwordMatch) {
                console.log('✅ Staff login successful');
                const userObject = {
                  id: staff.id,
                  email: staff.email,
                  name: staff.name,
                  role: 'STAFF',
                  businessId: staff.businessId,
                  staffRole: staff.role,
                  businessName: staff.business?.name,
                  permissions: staff.role === 'ADMIN' ? ['canManageBusiness', 'canManageStaff', 'canViewAll'] : ['canViewSchedule']
                };
                console.log('✅ RETURNING STAFF USER OBJECT:', JSON.stringify(userObject, null, 2));
                return userObject;
              }
            }

            // FALLBACK: Check business table only if no staff found
            // This should rarely be used since business owners should have staff records
            console.log('🏢 No staff found, checking business table as fallback...');
            const business = await prisma.business.findUnique({
              where: { email: credentials.email }
            });

            console.log('🏢 Business found:', !!business);
            if (business) {
              console.log('📊 Business data:', {
                id: business.id,
                email: business.email,
                name: business.name,
                ownerName: business.ownerName,
                passwordHashLength: business.passwordHash?.length
              });
              
              console.log('⚠️ WARNING: Business owner logging in without staff record!');
              console.log('💡 This should be rare - business owners should have staff admin records');
            }

            if (business) {
              console.log('🔒 Comparing business password...');
              const passwordMatch = await compare(credentials.password, business.passwordHash);
              console.log('🔐 Business password match:', passwordMatch);
              
              if (passwordMatch) {
                console.log('✅ Business login successful (fallback mode)');
                const userObject = {
                  id: business.id,
                  email: business.email,
                  name: business.ownerName || business.name,
                  role: 'STAFF', // Treat business owners as staff for consistency
                  businessId: business.id,
                  staffRole: 'ADMIN',
                  businessName: business.name,
                  permissions: ['canManageBusiness', 'canManageStaff', 'canViewAll']
                };
                console.log('✅ RETURNING BUSINESS USER OBJECT (as staff):', JSON.stringify(userObject, null, 2));
                return userObject;
              }
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
      console.log('🔄 REDIRECT CALLBACK CALLED:', { url, baseUrl });
      
      // Redirect admin users to admin dashboard
      if (url.includes('admin-signin') || url.includes('role=ADMIN')) {
        console.log('🔄 Redirecting to admin dashboard');
        return `${baseUrl}/admin/dashboard`;
      }
      
      // If redirecting from successful login, check user type
      if (url.includes('staff/dashboard') || url.includes('callbackUrl')) {
        console.log('🔄 Redirecting to staff dashboard');
        return `${baseUrl}/staff/dashboard`;
      }
      
      // Default redirect for other users (staff/business owners go to staff portal)
      const finalUrl = url.startsWith(baseUrl) ? url : `${baseUrl}/staff/dashboard`;
      console.log('🔄 Final redirect URL:', finalUrl);
      return finalUrl;
    }
  }
}; 