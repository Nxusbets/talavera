import { Router } from 'express';
import { Knex } from 'knex';
import { PlanController } from '../controllers/PlanController.js';
import { SubscriptionController } from '../controllers/SubscriptionController.js';
import { PlanRepository } from '../repositories/PlanRepository.js';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { SubscriptionService } from '../services/SubscriptionService.js';
import { AuthService } from '../services/AuthService.js';
import { MockStripeAdapter } from '../adapters/MockStripeAdapter.js';
import { createAuthMiddleware } from '../middleware/authMiddleware.js';

/**
 * Create subscription and plan routes
 */
export function createSubscriptionRoutes(knex: Knex): Router {
  const router = Router();

  // Initialize repositories and services
  const userRepository = new UserRepository(knex);
  const planRepository = new PlanRepository(knex);
  const subscriptionRepository = new SubscriptionRepository(knex);
  const authService = new AuthService(userRepository);
  const paymentAdapter = new MockStripeAdapter();
  const subscriptionService = new SubscriptionService(
    knex,
    userRepository,
    planRepository,
    subscriptionRepository,
    paymentAdapter
  );

  const planController = new PlanController(planRepository);
  const subscriptionController = new SubscriptionController(subscriptionService);

  // Middleware
  const authMiddleware = createAuthMiddleware(authService);

  // Routes - Plans (public)
  router.get('/', (req, res) => planController.list(req, res));

  // Routes - Subscriptions (protected)
  router.post('/create', authMiddleware, (req, res) => subscriptionController.create(req, res));
  router.get('/current', authMiddleware, (req, res) => subscriptionController.get(req, res));

  return router;
}
