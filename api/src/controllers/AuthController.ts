import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AuthService } from '../services/AuthService.js';
import { SignUpSchema, SignInSchema } from '../schemas/auth.js';

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
 * AuthController handles authentication requests
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/auth/signup
   */
  async signup(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const data = SignUpSchema.parse(req.body);

      // Sign up user
      const authToken = await this.authService.signup(
        data.email,
        data.password,
        data.locale
      );

      res.status(201).json({
        data: authToken,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        const errorKey = (firstError.message as string) || 'errors.validation_error';
        res.status(400).json(
          createErrorResponse(errorKey, firstError.code)
        );
        return;
      }

      if (error instanceof Error) {
        if (error.message === 'errors.email_already_exists') {
          res.status(409).json(
            createErrorResponse(
              'errors.email_already_exists',
              'Email already registered'
            )
          );
          return;
        }

        console.error('[AuthController.signup] Error:', error.message, error);
        res.status(400).json(
          createErrorResponse(error.message, error.message)
        );
        return;
      }

      console.error('[AuthController.signup] Unknown error:', error);
      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }

  /**
   * POST /api/auth/signin
   */
  async signin(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const data = SignInSchema.parse(req.body);

      // Sign in user
      const authToken = await this.authService.signin(data.email, data.password);

      res.status(200).json({
        data: authToken,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        const errorKey = (firstError.message as string) || 'errors.validation_error';
        res.status(400).json(
          createErrorResponse(errorKey, firstError.code)
        );
        return;
      }

      if (error instanceof Error) {
        if (error.message === 'errors.invalid_credentials') {
          res.status(401).json(
            createErrorResponse(
              'errors.invalid_credentials',
              'Invalid email or password'
            )
          );
          return;
        }

        console.error('[AuthController.signin] Error:', error.message, error);
        res.status(400).json(
          createErrorResponse(error.message, error.message)
        );
        return;
      }

      console.error('[AuthController.signin] Unknown error:', error);
      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }
}
