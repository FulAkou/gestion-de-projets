import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters'),
  client: z.string()
    .min(1, 'Client is required'),
  category: z.string()
    .min(1, 'Category is required'),
  status: z.enum(['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'])
    .default('pending'),
  startDate: z.string()
    .optional()
    .or(z.literal('')),
  endDate: z.string()
    .optional()
    .or(z.literal('')),
});

export const updateProjectSchema = createProjectSchema.partial();
