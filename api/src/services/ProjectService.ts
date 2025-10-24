import { UserRepository } from '../repositories/UserRepository.js';
import { ProjectRepository } from '../repositories/ProjectRepository.js';
import { Project } from '../types/index.js';

/**
 * ProjectService handles project business logic
 */
export class ProjectService {
  constructor(
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository
  ) {}

  /**
   * Create a new project
   */
  async create(userId: number, name: string, description?: string): Promise<Project> {
    // Get user to check quota
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('errors.user_not_found');
    }

    // Check if user has reached quota
    const projectCount = await this.projectRepository.countByUserId(userId);
    if (projectCount >= user.projects_quota) {
      throw new Error('errors.quota_exceeded');
    }

    // Generate slug from name
    const slug = this.generateSlug(name);

    // Check if slug is unique for this user
    const isUnique = await this.projectRepository.isSlugUnique(userId, slug);
    if (!isUnique) {
      throw new Error('errors.slug_already_exists');
    }

    // Create project
    return this.projectRepository.create(userId, name, slug, description);
  }

  /**
   * Get all projects for a user
   */
  async getProjectsByUser(userId: number): Promise<Project[]> {
    return this.projectRepository.findByUserId(userId);
  }

  /**
   * Get a single project (with authorization check)
   */
  async getProject(projectId: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findByIdAndUserId(
      projectId,
      userId
    );

    if (!project) {
      throw new Error('errors.project_not_found');
    }

    return project;
  }

  /**
   * Delete a project (with authorization check)
   */
  async deleteProject(projectId: number, userId: number): Promise<void> {
    const project = await this.projectRepository.findByIdAndUserId(
      projectId,
      userId
    );

    if (!project) {
      throw new Error('errors.project_not_found');
    }

    await this.projectRepository.delete(projectId);
  }

  /**
   * Generate URL-safe slug from project name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}
