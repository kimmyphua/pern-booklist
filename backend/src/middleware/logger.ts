import { NextFunction, Request, Response } from 'express'

// Simple logger middleware
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
    )
  })

  next()
}

// Create a logger object for use in resolvers
export const createLogger = () => ({
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '')
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? JSON.stringify(error) : '')
  }
}) 