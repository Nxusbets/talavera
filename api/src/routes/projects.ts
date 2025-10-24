import { Router } from 'express';
import { Knex } from 'knex';
import { ProjectController } from '../controllers/ProjectController.js';
import { ProjectService } from '../services/ProjectService.js';
import { ProjectRepository } from '../repositories/ProjectRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { createAuthMiddleware } from '../middleware/authMiddleware.js';
import { createQuotaMiddleware } from '../middleware/quotaMiddleware.js';
import { AuthService } from '../services/AuthService.js';

/**
 * Create project routes
 */
export function createProjectRoutes(knex: Knex): Router {
  const router = Router();

  // Initialize repositories and services
  const userRepository = new UserRepository(knex);
  const projectRepository = new ProjectRepository(knex);
  const authService = new AuthService(userRepository);
  const projectService = new ProjectService(userRepository, projectRepository);
  const projectController = new ProjectController(projectService);

  // Middleware
  const authMiddleware = createAuthMiddleware(authService);
  const quotaMiddleware = createQuotaMiddleware(userRepository, projectRepository);

  // Routes
  router.post(
    '/',
    authMiddleware,
    quotaMiddleware,
    (req, res) => projectController.create(req, res)
  );
  router.get('/', authMiddleware, (req, res) => projectController.list(req, res));
  router.get('/:id', authMiddleware, (req, res) => projectController.get(req, res));
  router.delete('/:id', authMiddleware, (req, res) => projectController.delete(req, res));

  return router;
}
