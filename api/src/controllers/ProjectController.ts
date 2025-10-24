import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ProjectService } from '../services/ProjectService.js';
import { CreateProjectSchema } from '../schemas/projects.js';

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
 * ProjectController handles project requests
 */
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  /**
   * POST /api/projects - Create a new project
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('errors.unauthorized', 'Unauthorized'));
        return;
      }

      // Validate request body
      const data = CreateProjectSchema.parse(req.body);

      // Create project
      const project = await this.projectService.create(
        req.user.userId,
        data.name,
        data.description
      );

      res.status(201).json({
        data: project,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        const errorKey = (firstError.message as string) || 'errors.validation_error';
        res.status(400).json(createErrorResponse(errorKey, firstError.code));
        return;
      }

      if (error instanceof Error) {
        if (error.message === 'errors.quota_exceeded') {
          res.status(403).json(
            createErrorResponse('errors.quota_exceeded', 'Project quota exceeded')
          );
          return;
        }

        if (error.message === 'errors.user_not_found') {
          res.status(404).json(
            createErrorResponse('errors.user_not_found', 'User not found')
          );
          return;
        }

        res.status(400).json(createErrorResponse(error.message, error.message));
        return;
      }

      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }

  /**
   * GET /api/projects - List user's projects
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('errors.unauthorized', 'Unauthorized'));
        return;
      }

      const projects = await this.projectService.getProjectsByUser(req.user.userId);

      res.status(200).json({
        data: projects,
      });
    } catch (error) {
      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }

  /**
   * GET /api/projects/:id - Get a single project
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('errors.unauthorized', 'Unauthorized'));
        return;
      }

      const projectId = parseInt(req.params.id, 10);
      if (isNaN(projectId)) {
        res.status(400).json(createErrorResponse('errors.invalid_id', 'Invalid project ID'));
        return;
      }

      const project = await this.projectService.getProject(projectId, req.user.userId);

      res.status(200).json({
        data: project,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'errors.project_not_found') {
          res.status(404).json(
            createErrorResponse('errors.project_not_found', 'Project not found')
          );
          return;
        }
      }

      res.status(500).json(
        createErrorResponse('errors.internal_error', 'Internal server error')
      );
    }
  }
}
