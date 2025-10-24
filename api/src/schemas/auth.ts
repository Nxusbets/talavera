import { z } from 'zod';

/**
 * Signup request validation schema
 */
export const SignUpSchema = z.object({
  email: z.string().email('errors.invalid_email'),
  password: z
    .string()
    .min(8, 'errors.password_too_short')
    .regex(/[A-Z]/, 'errors.password_uppercase')
    .regex(/[a-z]/, 'errors.password_lowercase')
    .regex(/[0-9]/, 'errors.password_digit'),
  locale: z.enum(['en', 'es']).default('en'),
});

export type SignUpRequest = z.infer<typeof SignUpSchema>;

/**
 * Signin request validation schema
 */
export const SignInSchema = z.object({
  email: z.string().email('errors.invalid_email'),
  password: z.string().min(1, 'errors.password_required'),
});

export type SignInRequest = z.infer<typeof SignInSchema>;
