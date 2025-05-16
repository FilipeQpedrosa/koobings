import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { CustomUser } from './auth';

export type MiddlewareConfig = {
  requiredRole?: 'staff' | 'business';
  requiredPermissions?: string[];
};

export async function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => Promise<void>,
  config?: MiddlewareConfig
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = session.user as CustomUser;

      // Check role if required
      if (config?.requiredRole && user.role !== config.requiredRole) {
        return res.status(403).json({ error: 'Forbidden: Insufficient role' });
      }

      // Check permissions if required
      if (config?.requiredPermissions) {
        const hasAllPermissions = config.requiredPermissions.every(
          permission => user.permissions?.includes(permission)
        );
        if (!hasAllPermissions) {
          return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
      }

      // Call the handler with the authenticated user
      return handler(req, res, user);
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => {
    try {
      await handler(req, res, user);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function withValidation<T>(
  schema: any,
  handler: (req: NextApiRequest, res: NextApiResponse, user: CustomUser, validData: T) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => {
    try {
      const validData = await schema.validate(req.body);
      return handler(req, res, user, validData);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}

export function withMethodCheck(
  allowedMethods: string[],
  handler: (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => {
    if (!allowedMethods.includes(req.method || '')) {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return handler(req, res, user);
  };
}

export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => Promise<void>,
  limit: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return async (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => {
    const key = `${user.id}-${req.method}-${req.url}`;
    const now = Date.now();
    const requestData = requests.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > requestData.resetTime) {
      requestData.count = 0;
      requestData.resetTime = now + windowMs;
    }

    requestData.count++;
    requests.set(key, requestData);

    if (requestData.count > limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    return handler(req, res, user);
  };
} 