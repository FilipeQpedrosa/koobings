import * as Sentry from '@sentry/nextjs'
import { env } from './env'

const SENTRY_DSN = env.SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: env.NODE_ENV === 'development',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Prisma({ client: true }),
    ],
    beforeSend(event) {
      // Don't send events in development
      if (env.NODE_ENV === 'development') {
        return null
      }
      return event
    },
  })
}

export { Sentry } 