import { Knex } from 'knex';
import { UserRepository } from '../repositories/UserRepository.js';
import { PlanRepository } from '../repositories/PlanRepository.js';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository.js';
import { IPaymentAdapter } from '../adapters/IPaymentAdapter.js';
import { Subscription, User } from '../types/index.js';

/**
 * Result of subscription upgrade
 */
export interface UpgradeResult {
  subscription: Subscription;
  user: User;
}

/**
 * SubscriptionService handles subscription business logic
 */
export class SubscriptionService {
  constructor(
    private knex: Knex,
    private userRepository: UserRepository,
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
    private paymentAdapter: IPaymentAdapter
  ) {}

  /**
   * Upgrade user to a new plan (atomically)
   */
  async upgrade(userId: number, planId: number): Promise<UpgradeResult> {
    // Fetch user and plan in parallel
    const [user, plan] = await Promise.all([
      this.userRepository.findById(userId),
      this.planRepository.findById(planId),
    ]);

    if (!user) {
      throw new Error('errors.user_not_found');
    }

    if (!plan) {
      throw new Error('errors.plan_not_found');
    }

    // Check if trying to downgrade
    if (user.plan === 'pro' && plan.code === 'free') {
      throw new Error('errors.cannot_downgrade');
    }

    // Check if already on this plan
    if (user.plan === plan.code) {
      throw new Error('errors.already_on_plan');
    }

    // Process payment through adapter
    const paymentResult = await this.paymentAdapter.createSubscription(
      userId,
      planId,
      plan.price
    );

    if (!paymentResult.success) {
      throw new Error('errors.payment_failed');
    }

    // Execute atomic transaction
    const result = await this.knex.transaction(async (trx) => {
      // 1. Create subscription record
      const subscription = await trx('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          started_at: trx.fn.now(),
        })
        .returning('*');

      const subscriptionId = subscription[0].id;

      // 2. Create invoice record
      await trx('invoices').insert({
        user_id: userId,
        subscription_id: subscriptionId,
        invoice_number: this.generateInvoiceNumber(),
        amount: plan.price,
        status: 'paid',
      });

      // 3. Update user's plan and quota
      const updatedUser = await trx('users')
        .where({ id: userId })
        .update({
          plan: plan.code,
          projects_quota: plan.projects_quota,
        })
        .returning('*');

      return {
        subscription: subscription[0],
        user: updatedUser[0],
      };
    });

    return result as UpgradeResult;
  }

  /**
   * Get user's current subscription
   */
  async getSubscription(userId: number): Promise<Subscription | null> {
    return this.subscriptionRepository.findByUserId(userId);
  }

  /**
   * Cancel a subscription
   */
  async cancel(subscriptionId: number): Promise<Subscription> {
    return this.subscriptionRepository.cancel(subscriptionId);
  }

  /**
   * Generate unique invoice number
   * Format: INV-YYYYMMDD-XXXX
   */
  private generateInvoiceNumber(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    return `INV-${year}${month}${day}-${sequence}`;
  }
}
