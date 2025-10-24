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
   * Find user's active subscription with plan details
   */
  async findByUserId(userId: number): Promise<Subscription | null> {
    const subscription = await this.knex('subscriptions')
      .where('subscriptions.user_id', userId)
      .where('subscriptions.status', 'active')
      .join('plans', 'subscriptions.plan_id', 'plans.id')
      .select(
        'subscriptions.*',
        'plans.id as plan_id',
        'plans.code as plan_code',
        'plans.name_en as plan_name_en',
        'plans.name_es as plan_name_es',
        'plans.projects_quota as plan_projects_quota',
        'plans.price as plan_price'
      )
      .orderBy('subscriptions.created_at', 'desc')
      .first();

    if (!subscription) return null;

    // Transform the response to include nested plan object
    return {
      ...subscription,
      plan: {
        id: subscription.plan_id,
        code: subscription.plan_code,
        name_en: subscription.plan_name_en,
        name_es: subscription.plan_name_es,
        projects_quota: subscription.plan_projects_quota,
        price: subscription.plan_price,
      },
    } as any;
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
