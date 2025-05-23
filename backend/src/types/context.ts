import { Request, Response } from 'express'

export interface User {
  id: number
  name: string
  role: 'ADMIN' | 'USER'
}

// Extend Express Request type
declare module 'express' {
  interface Request {
    user?: User
  }
}

export interface MyContext {
  req: Request
  res: Response
  user?: User
  logger: {
    info: (message: string, meta?: any) => void
    error: (message: string, error?: any) => void
  }
} 