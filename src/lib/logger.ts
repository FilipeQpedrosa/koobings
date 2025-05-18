import winston from 'winston'
import { format } from 'winston'

const { combine, timestamp, printf, colorize, errors } = format

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`
  
  if (metadata.error) {
    const error = metadata.error
    msg += `\nError: ${error.message}`
    if (error.stack) {
      msg += `\nStack: ${error.stack}`
    }
  }
  
  if (Object.keys(metadata).length > 0) {
    msg += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`
  }
  
  return msg
})

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    logFormat
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      ),
    }),
    // File transport for production
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    ] : [])
  ],
  // Handle uncaught exceptions and rejections
  handleExceptions: true,
  handleRejections: true,
  exitOnError: false,
})

// Add request context middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now()
  
  // Log request
  logger.info(`Incoming ${req.method} request to ${req.url}`, {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers,
    ip: req.ip,
  })

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`Outgoing response for ${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    })
  })

  next()
}

// Add error logging middleware
export const errorLogger = (err: Error, req: any, res: any, next: any) => {
  logger.error('Unhandled error', {
    error: err,
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    user: req.user?.id,
  })
  next(err)
} 