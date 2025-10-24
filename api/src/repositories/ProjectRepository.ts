import { Knex } from 'knex';
import { Project } from '../types/index.js';

/**
 * ProjectRepository handles all project database operations
 */
export class ProjectRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new project
   */
  async create(
    userId: number,
    name: string,
    slug: string,
    description?: string
  ): Promise<Project> {
    const [project] = await this.knex('projects')
      .insert({
        user_id: userId,
        name,
        slug,
        description,
      })
      .returning('*');

    return project as Project;
  }

  /**
   * Find projects by user ID
   */
  async findByUserId(userId: number): Promise<Project[]> {
    const projects = await this.knex('projects')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    return projects as Project[];
  }

  /**
   * Count projects by user ID
   */
  async countByUserId(userId: number): Promise<number> {
    const result = await this.knex('projects')
      .where({ user_id: userId })
      .count('* as count')
      .first();

    return (result as any).count || 0;
  }

  /**
   * Find project by ID
   */
  async findById(projectId: number): Promise<Project | null> {
    const project = await this.knex('projects')
      .where({ id: projectId })
      .first();

    return (project as Project) || null;
  }

  /**
   * Find project by ID and user ID (for authorization)
   */
  async findByIdAndUserId(
    projectId: number,
    userId: number
  ): Promise<Project | null> {
    const project = await this.knex('projects')
      .where({ id: projectId, user_id: userId })
      .first();

    return (project as Project) || null;
  }

  /**
   * Check if slug is unique for a user
   */
  async isSlugUnique(userId: number, slug: string): Promise<boolean> {
    const result = await this.knex('projects')
      .where({ user_id: userId, slug })
      .first();

    return !result;
  }
}
