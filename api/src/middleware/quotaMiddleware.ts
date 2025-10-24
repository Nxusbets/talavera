import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/UserRepository.js';
import { ProjectRepository } from '../repositories/ProjectRepository.js';

/**
 * Quota middleware to check if user can create more projects
 */
export function createQuotaMiddleware(
  userRepository: UserRepository,
  projectRepository: ProjectRepository
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            key: 'errors.unauthorized',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const user = await userRepository.findById(req.user.userId);
      if (!user) {
        res.status(401).json({
          error: {
            key: 'errors.user_not_found',
            message: 'User not found',
          },
        });
        return;
      }

      const projectCount = await projectRepository.countByUserId(req.user.userId);

      if (projectCount >= user.projects_quota) {
        res.status(403).json({
          error: {
            key: 'errors.quota_exceeded',
            message: `You have reached your project quota of ${user.projects_quota}`,
          },
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        error: {
          key: 'errors.internal_error',
          message: 'Internal server error',
        },
      });
    }
  };
}
