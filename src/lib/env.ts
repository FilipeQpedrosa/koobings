import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  
  // Email
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // External Services
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  
  // AWS
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_BACKUP_BUCKET: z.string().optional(),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).optional().default('3000'),
  
  // Security
  CORS_ORIGINS: z.string().transform(origins => origins.split(',')).default('*'),
  RATE_LIMIT_REQUESTS: z.string().transform(Number).default('100'),
  RATE_LIMIT_DURATION: z.string().transform(Number).default('900'), // 15 minutes
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOGFLARE_API_KEY: z.string().optional(),
  LOGFLARE_SOURCE_ID: z.string().optional(),
  
  // CDN
  CDN_URL: z.string().url().optional(),
  
  // Database Pool
  DB_POOL_SIZE: z.string().transform(Number).default('10'),
  DB_CONNECT_TIMEOUT: z.string().transform(Number).default('5000'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      throw new Error(`❌ Invalid environment variables:\n${missingVars}`)
    }
    throw error
  }
}

export const env = validateEnv() 