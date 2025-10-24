import { z } from 'zod';

/**
 * Create subscription request validation schema
 */
export const CreateSubscriptionSchema = z.object({
  planId: z.number().int().positive('errors.invalid_plan_id'),
});

export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionSchema>;
