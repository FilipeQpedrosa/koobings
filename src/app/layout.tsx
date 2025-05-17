import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { initializeServices } from '@/lib/init';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beauty & Wellness Center',
  description: 'Professional beauty and wellness service scheduling platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize services in development
  if (process.env.NODE_ENV === 'development') {
    initializeServices();
  }

  // In production, initialize services only on the server side
  if (process.env.NODE_ENV === 'production' && !headers().get('x-powered-by')) {
    initializeServices();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
