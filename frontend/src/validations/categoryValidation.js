import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  type: z.enum(['project', 'task'])
    .default('project'),
  description: z.string()
    .max(200, 'Description must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
});

export const updateCategorySchema = createCategorySchema.partial();
