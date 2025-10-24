import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

/**
 * Auth middleware to verify JWT tokens
 */
export function createAuthMiddleware(authService: AuthService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Extract token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          error: {
            key: 'errors.missing_token',
            message: 'Missing authorization token',
          },
        });
        return;
      }

      const token = authHeader.slice(7); // Remove "Bearer " prefix

      // Verify token
      const payload = authService.verifyJWT(token);

      // Attach user to request
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };

      next();
    } catch (error) {
      res.status(401).json({
        error: {
          key: 'errors.invalid_token',
          message: 'Invalid or expired token',
        },
      });
    }
  };
}
