import pino from 'pino'
import { env } from './env'

const transport = pino.transport({
  targets: [
    // Console logging
    {
      target: 'pino-pretty',
      level: env.NODE_ENV === 'development' ? 'debug' : 'info',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:standard'
      }
    },
    // Production logging service (if configured)
    ...(env.LOGFLARE_API_KEY && env.LOGFLARE_SOURCE_ID
      ? [{
          target: 'pino-logflare',
          level: 'info',
          options: {
            apiKey: env.LOGFLARE_API_KEY,
            sourceToken: env.LOGFLARE_SOURCE_ID
          }
        }]
      : [])
  ]
})

const logger = pino(
  {
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    base: {
      env: env.NODE_ENV,
      revision: process.env.VERCEL_GIT_COMMIT_SHA,
    },
    redact: {
      paths: [
        'email',
        'password',
        'passwordHash',
        'authorization',
        '*.password',
        '*.token',
        '*.key'
      ],
      remove: true
    }
  },
  transport
)

type LogContext = Record<string, unknown>

export class Logger {
  private context?: LogContext

  constructor(context?: LogContext) {
    this.context = context
  }

  private formatMessage(message: string, context?: LogContext): object {
    return {
      msg: message,
      ...this.context,
      ...context
    }
  }

  debug(message: string, context?: LogContext) {
    logger.debug(this.formatMessage(message, context))
  }

  info(message: string, context?: LogContext) {
    logger.info(this.formatMessage(message, context))
  }

  warn(message: string, context?: LogContext) {
    logger.warn(this.formatMessage(message, context))
  }

  error(message: string, error?: Error, context?: LogContext) {
    logger.error(
      {
        err: error,
        ...this.formatMessage(message, context)
      }
    )
  }

  child(context: LogContext) {
    return new Logger({
      ...this.context,
      ...context
    })
  }
}

export const log = new Logger() 