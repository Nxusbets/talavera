import { Request, Response } from 'express';
import { PlanRepository } from '../repositories/PlanRepository.js';

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
 * PlanController handles plan requests
 */
export class PlanController {
  constructor(private planRepository: PlanRepository) {}

  /**
   * GET /api/plans - List all available plans
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const plans = await this.planRepository.all();

      res.status(200).json({
        data: plans,
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }
}
