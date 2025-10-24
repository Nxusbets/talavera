/**
 * Payment adapter interface for payment processing
 * This follows the Adapter (Seam) pattern to allow swapping
 * payment providers without changing service code
 */

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface IPaymentAdapter {
  /**
   * Process subscription creation (e.g., charge customer)
   */
  createSubscription(
    userId: number,
    planId: number,
    amount: number
  ): Promise<PaymentResult>;

  /**
   * Cancel an existing subscription
   */
  cancelSubscription(subscriptionId: string): Promise<void>;
}
