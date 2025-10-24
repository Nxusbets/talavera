import { Router } from 'express';
import { Knex } from 'knex';
import { AuthController } from '../controllers/AuthController.js';
import { AuthService } from '../services/AuthService.js';
import { UserRepository } from '../repositories/UserRepository.js';

/**
 * Create auth routes
 */
export function createAuthRoutes(knex: Knex): Router {
  const router = Router();
  const userRepository = new UserRepository(knex);
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/signin', (req, res) => authController.signin(req, res));

  return router;
}
