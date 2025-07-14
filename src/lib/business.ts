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
 * Ensure slug is unique by adding suffix if needed
 */
export async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
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
      // slug: true, // COMMENTED - column does not exist in current database
      features: true,
      plan: true,
      logo: true,
      settings: true
    }
  });
}

/**
 * Check if business has a specific feature enabled
 */
export async function hasFeature(businessId: string, feature: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { features: true, plan: true }
  });

  if (!business) return false;

  // Check feature flags
  const features = business.features as Record<string, boolean> || {};
  if (features[feature] !== undefined) {
    return features[feature];
  }

  // Default features by plan
  const defaultFeatures = getDefaultFeaturesByPlan(business.plan);
  return defaultFeatures[feature] || false;
}

/**
 * Get default features by plan
 */
function getDefaultFeaturesByPlan(plan: string): Record<string, boolean> {
  const planFeatures = {
    basic: {
      multipleStaff: false,
      advancedReports: false,
      smsNotifications: false,
      customBranding: false,
      apiAccess: false,
      calendarIntegration: false,
    },
    standard: {
      multipleStaff: true,
      advancedReports: true,
      smsNotifications: false,
      customBranding: false,
      apiAccess: false,
      calendarIntegration: true,
    },
    premium: {
      multipleStaff: true,
      advancedReports: true,
      smsNotifications: true,
      customBranding: true,
      apiAccess: true,
      calendarIntegration: true,
    }
  };

  return planFeatures[plan as keyof typeof planFeatures] || planFeatures.basic;
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