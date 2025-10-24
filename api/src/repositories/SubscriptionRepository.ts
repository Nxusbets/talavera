import { Knex } from 'knex';
import { Subscription } from '../types/index.js';

/**
 * SubscriptionRepository handles all subscription database operations
 */
export class SubscriptionRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new subscription
   */
  async create(
    userId: number,
    planId: number,
    status: 'active' | 'pending' | 'cancelled' = 'active'
  ): Promise<Subscription> {
    const [subscription] = await this.knex('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status,
        started_at: this.knex.fn.now(),
      })
      .returning('*');

    return subscription as Subscription;
  }

  /**
   * Find user's active subscription
   */
  async findByUserId(userId: number): Promise<Subscription | null> {
    const subscription = await this.knex('subscriptions')
      .where({ user_id: userId, status: 'active' })
      .orderBy('created_at', 'desc')
      .first();

    return (subscription as Subscription) || null;
  }

  /**
   * Find subscription by ID
   */
  async findById(id: number): Promise<Subscription | null> {
    const subscription = await this.knex('subscriptions').where({ id }).first();
    return (subscription as Subscription) || null;
  }

  /**
   * Cancel a subscription
   */
  async cancel(subscriptionId: number): Promise<Subscription> {
    const [subscription] = await this.knex('subscriptions')
      .where({ id: subscriptionId })
      .update({ status: 'cancelled' })
      .returning('*');

    return subscription as Subscription;
  }
}
