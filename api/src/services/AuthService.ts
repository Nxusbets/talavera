import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthToken, JWTPayload } from '../types/index.js';
import { UserRepository } from '../repositories/UserRepository.js';

/**
 * AuthService handles authentication logic
 */
export class AuthService {
  private jwtSecret: string;
  private jwtExpiration: string = '24h';

  constructor(
    private userRepository: UserRepository,
    jwtSecret: string = process.env.JWT_SECRET || 'dev-secret-key'
  ) {
    this.jwtSecret = jwtSecret;
  }

  /**
   * Sign up a new user
   */
  async signup(
    email: string,
    password: string,
    locale: string = 'en'
  ): Promise<AuthToken> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('errors.email_already_exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await this.userRepository.create(email, passwordHash, locale);

    // Generate JWT
    const token = this.generateJWT(user.id, user.email);

    return {
      token,
      userId: user.id,
      email: user.email,
    };
  }

  /**
   * Sign in user
   */
  async signin(email: string, password: string): Promise<AuthToken> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('errors.invalid_credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('errors.invalid_credentials');
    }

    // Generate JWT
    const token = this.generateJWT(user.id, user.email);

    return {
      token,
      userId: user.id,
      email: user.email,
    };
  }

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  private generateJWT(userId: number, email: string): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId,
      email,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration as string | number,
    } as any);
  }

  /**
   * Verify JWT token and return payload
   */
  verifyJWT(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new Error('errors.invalid_token');
    }
  }
}
