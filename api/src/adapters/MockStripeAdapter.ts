import { IPaymentAdapter, PaymentResult } from './IPaymentAdapter.js';

/**
 * Mock Stripe adapter for development and testing
 * Simulates successful payments without actually charging
 */
export class MockStripeAdapter implements IPaymentAdapter {
  /**
   * Simulate stripe charge (always succeeds in dev)
   */
  async createSubscription(
    userId: number,
    planId: number,
    _amount: number
  ): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // In production, this would call real Stripe API
    // For now, we just return success with a mock transaction ID
    return {
      success: true,
      transactionId: `mock-stripe-${Date.now()}-${userId}-plan${planId}`,
    };
  }

  /**
   * Simulate canceling subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    // In production, would call Stripe API to cancel
    // For now, just log and return
    console.log(`[MockStripe] Cancelled subscription: ${subscriptionId}`);
  }
}
