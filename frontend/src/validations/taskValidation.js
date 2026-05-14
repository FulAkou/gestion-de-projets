import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must not exceed 200 characters'),
  description: z.string()
    .optional()
    .or(z.literal('')),
  project: z.string()
    .min(1, 'Project is required'),
  category: z.string()
    .min(1, 'Category is required'),
  assignedTo: z.string()
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'on_hold', 'in_progress', 'completed', 'cancelled'])
    .default('pending'),
  priority: z.enum(['low', 'medium', 'high'])
    .default('medium'),
  dueDate: z.string()
    .optional()
    .or(z.literal('')),

});

export const updateTaskSchema = createTaskSchema.partial();
