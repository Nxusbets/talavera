import { z } from 'zod';

/**
 * Create project request validation schema
 */
export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'errors.project_name_required')
    .max(100, 'errors.project_name_too_long'),
  description: z.string().max(500, 'errors.project_description_too_long').optional(),
});

export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>;
