import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { SubscriptionService } from '../services/SubscriptionService.js';
import { CreateSubscriptionSchema } from '../schemas/subscriptions.js';

/**
 * Error response builder
 */
function createErrorResponse(
  errorKey: string,
  message: string
): { error: { key: string; message: string } } {
  return {
    error: {
      key: errorKey,
      message,
    },
  };
}

/**
 * SubscriptionController handles subscription requests
 */
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  /**
   * POST /api/subscriptions - Upgrade to a plan
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('errors.unauthorized', 'Unauthorized'));
        return;
      }

      // Validate request body
      const data = CreateSubscriptionSchema.parse(req.body);

      // Upgrade subscription
      const result = await this.subscriptionService.upgrade(req.user.userId, data.planId);

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        const errorKey = (firstError.message as string) || 'errors.validation_error';
        res.status(400).json(createErrorResponse(errorKey, firstError.code));
        return;
      }

      if (error instanceof Error) {
        if (error.message === 'errors.plan_not_found') {
          res.status(400).json(
            createErrorResponse('errors.plan_not_found', 'Plan not found')
          );
          return;
        }

        if (error.message === 'errors.user_not_found') {
          res.status(404).json(
            createErrorResponse('errors.user_not_found', 'User not found')
          );
          return;
        }

        if (error.message === 'errors.payment_failed') {
          res.status(402).json(
            createErrorResponse('errors.payment_failed', 'Payment processing failed')
          );
          return;
        }

        if (error.message === 'errors.cannot_downgrade') {
          res.status(400).json(
            createErrorResponse(
              'errors.cannot_downgrade',
              'Cannot downgrade from Pro to Free'
            )
          );
          return;
        }

        if (error.message === 'errors.already_on_plan') {
          res.status(409).json(
            createErrorResponse(
              'errors.already_on_plan',
              'Already subscribed to this plan'
            )
          );
          return;
        }

        console.error('[SubscriptionController.create] Error:', error.message, error);
        res.status(400).json(createErrorResponse(error.message, error.message));
        return;
      }

      console.error('[SubscriptionController.create] Unknown error:', error);
      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }

  /**
   * GET /api/subscriptions - Get user's current subscription
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('errors.unauthorized', 'Unauthorized'));
        return;
      }

      const subscription = await this.subscriptionService.getSubscription(req.user.userId);

      res.status(200).json({
        data: subscription,
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }
}
