import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; role: 'academic' | 'student'; subRole?: 'faculty' | 'administrative' };
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token as string | undefined;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  const payload = verifyAccessToken(token);
  if (!payload || payload.type !== 'access') {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
  
  try {
    // Fetch user to get subRole and verify user exists and is active
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    
    // Verify user is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Forbidden: Account is inactive' });
    }
    
    req.user = { 
      id: user.id, 
      role: user.role, 
      subRole: user.subRole 
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
}

export function requireRole(role: 'academic' | 'student') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

export function requireAdministrative() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'academic') return res.status(403).json({ message: 'Forbidden' });
    if (req.user.subRole !== 'administrative') return res.status(403).json({ message: 'Forbidden: Administrator access required' });
    next();
  };
}


