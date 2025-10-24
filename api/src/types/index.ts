/**
 * User type definition
 */
export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  locale: string;
  plan: 'free' | 'pro';
  projects_quota: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Auth token response
 */
export interface AuthToken {
  token: string;
  userId: number;
  email: string;
}

/**
 * JWT payload
 */
export interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Auth request payloads
 */
export interface SignUpPayload {
  email: string;
  password: string;
  locale?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

/**
 * Project type definition
 */
export interface Project {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Plan type definition
 */
export interface Plan {
  id: number;
  code: 'free' | 'pro';
  name_en: string;
  name_es: string;
  projects_quota: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Subscription type definition
 */
export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: 'active' | 'cancelled' | 'pending';
  started_at: Date;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Invoice type definition
 */
export interface Invoice {
  id: number;
  user_id: number;
  subscription_id: number;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  created_at: Date;
  updated_at: Date;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: {
    key: string;
    message: string;
  };
}
