import { Knex } from 'knex';
import { User } from '../types/index.js';

/**
 * UserRepository handles all user database operations
 */
export class UserRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new user
   */
  async create(
    email: string,
    passwordHash: string,
    locale: string = 'en'
  ): Promise<User> {
    const [user] = await this.knex('users')
      .insert({
        email,
        password_hash: passwordHash,
        locale,
        plan: 'free',
        projects_quota: 3, // Free plan quota
      })
      .returning('*');

    return user as User;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.knex('users').where({ email }).first();
    return (user as User) || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.knex('users').where({ id }).first();
    return (user as User) || null;
  }

  /**
   * Update user's projects quota (used when plan changes)
   */
  async updateProjectsQuota(userId: number, newQuota: number): Promise<User> {
    const [user] = await this.knex('users')
      .where({ id: userId })
      .update({ projects_quota: newQuota })
      .returning('*');

    return user as User;
  }

  /**
   * Update user plan
   */
  async updatePlan(
    userId: number,
    plan: 'free' | 'pro',
    quota: number
  ): Promise<User> {
    const [user] = await this.knex('users')
      .where({ id: userId })
      .update({ plan, projects_quota: quota })
      .returning('*');

    return user as User;
  }
}
