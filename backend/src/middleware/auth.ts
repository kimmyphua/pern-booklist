import { NextFunction, Request, Response } from 'express'
import { User } from '../types/context'

// This is a simple mock authentication middleware
// In a real application, you would validate JWT tokens or session cookies
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Mock user authentication
    // In a real app, you would validate the token from the Authorization header
    const authHeader = req.headers.authorization
    console.log('Auth header:', authHeader) // Debug log

    if (!authHeader) {
      console.log('No auth header found') // Debug log
      return next()
    }

    // Mock user data - in a real app, this would come from your database
    const mockUser: User = {
      id: 1,
      name: 'Test User',
      role: 'ADMIN' // Changed to ADMIN for testing
    }

    console.log('Setting user:', mockUser) // Debug log
    // Attach user to request
    req.user = mockUser
    next()
  } catch (error) {
    console.error('Auth error:', error) // Debug log
    next(error)
  }
}

// Middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new Error('Not authenticated')
  }
  next()
}

// Middleware to check if user is admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new Error('Not authorized')
  }
  next()
} 