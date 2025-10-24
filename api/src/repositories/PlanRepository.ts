import { Knex } from 'knex';
import { Plan } from '../types/index.js';

/**
 * PlanRepository handles all plan database operations
 */
export class PlanRepository {
  constructor(private knex: Knex) {}

  /**
   * Fetch all plans
   */
  async all(): Promise<Plan[]> {
    const plans = await this.knex('plans').orderBy('price', 'asc');
    return plans as Plan[];
  }

  /**
   * Find plan by ID
   */
  async findById(id: number): Promise<Plan | null> {
    const plan = await this.knex('plans').where({ id }).first();
    return (plan as Plan) || null;
  }

  /**
   * Find plan by code (e.g., 'free', 'pro')
   */
  async findByCode(code: string): Promise<Plan | null> {
    const plan = await this.knex('plans').where({ code }).first();
    return (plan as Plan) || null;
  }
}
