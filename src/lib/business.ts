import { prisma } from '@/lib/prisma';
import { Business } from '@prisma/client';

/**
 * Generate a URL-friendly slug from business name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove multiple consecutive hyphens
}

/**
 * Ensure unique slug by checking database
 */
export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug }
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Get business by slug with caching
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  return await prisma.business.findUnique({
    where: { 
      slug,
      status: 'ACTIVE' // Only active businesses
    }
  });
}

/**
 * Get business with features for feature flag checking
 */
export async function getBusinessWithFeatures(slug: string) {
  return await prisma.business.findUnique({
    where: { 
      slug,
      status: 'ACTIVE'
    },
    select: {
      id: true,
      name: true,
      slug: true, // Include real slug field
      features: true,
      plan: true,
      logo: true,
      settings: true
    }
  });
}

/**
 * Get business by ID with features
 */
export async function getBusinessWithFeaturesById(id: string) {
  return await prisma.business.findUnique({
    where: { 
      id,
      status: 'ACTIVE'
    },
    select: {
      id: true,
      name: true,
      slug: true,
      features: true,
      plan: true,
      logo: true,
      settings: true
    }
  });
}

/**
 * Check if business has feature enabled
 */
export function hasFeature(business: any, feature: string): boolean {
  if (!business?.features) return false;
  return business.features[feature] === true;
}

/**
 * Get business plan limits
 */
export function getPlanLimits(plan: string) {
  const limits = {
    basic: {
      maxStaff: 3,
      maxServices: 10,
      maxBookingsPerMonth: 100
    },
    standard: {
      maxStaff: 10,
      maxServices: 50,
      maxBookingsPerMonth: 500
    },
    premium: {
      maxStaff: -1, // unlimited
      maxServices: -1, // unlimited
      maxBookingsPerMonth: -1 // unlimited
    }
  };
  
  return limits[plan as keyof typeof limits] || limits.basic;
}

/**
 * Check if business can add more staff
 */
export async function canAddMoreStaff(businessId: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { plan: true },
  });
  
  if (!business) return false;
  
  const limits = getPlanLimits(business.plan || 'basic');
  if (limits.maxStaff === -1) return true; // unlimited
  
  const currentStaffCount = await prisma.staff.count({
    where: { businessId }
  });
  
  return currentStaffCount < limits.maxStaff;
}

/**
 * Extract business slug from pathname
 */
export function extractBusinessSlug(pathname: string): string | null {
  // Match patterns like /business-slug/staff/dashboard
  const match = pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
  return match ? match[1] : null;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
} 