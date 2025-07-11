import { ReactNode } from 'react';

interface BusinessLayoutProps {
  children: ReactNode;
  params: Promise<{
    businessSlug: string;
  }>;
}

export default async function BusinessLayout({ 
  children,
  params
}: BusinessLayoutProps) {
  const { businessSlug } = await params;
  
  // Basic layout for business-specific routes
  // In the future, this could include business-specific branding, navigation, etc.
  return (
    <div data-business-slug={businessSlug}>
      {children}
    </div>
  );
} 