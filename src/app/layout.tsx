import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { initializeServices } from '@/lib/init';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
// import EnvironmentBanner from '@/components/layout/EnvironmentBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Koobings – Marca. Segue. Está feito.',
  description: 'Marca. Segue. Está feito. A plataforma que simplifica a gestão do seu negócio.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize services in development
  if (process.env.NODE_ENV === 'development') {
    initializeServices();
  }

  // In production, initialize services only on the server side
  if (process.env.NODE_ENV === 'production') {
    const hdrs = await headers();
    if (!hdrs.get('x-powered-by')) {
      initializeServices();
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* <EnvironmentBanner /> */}
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
