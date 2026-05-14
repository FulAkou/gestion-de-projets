import { z } from 'zod';

/**
 * Schéma de validation pour la création de tâches
 */
export const createTaskSchema = z.object({
  name: z.string()
    .min(2, 'Task name must be at least 2 characters')
    .max(200, 'Task name must not exceed 200 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  status: z.enum(['pending', 'on_hold', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }).optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
  }).optional(),
  dueDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  assignedUserId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
    .optional()
    .nullable(),
  projectId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
  categoryId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
});

/**
 * Schéma de validation pour la mise à jour de tâches
 */
export const updateTaskSchema = z.object({
  name: z.string()
    .min(2, 'Task name must be at least 2 characters')
    .max(200, 'Task name must not exceed 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  status: z.enum(['pending', 'on_hold', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }).optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
  }).optional(),
  dueDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  assignedUserId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
    .optional()
    .nullable(),
  projectId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID')
    .optional(),
  categoryId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
    .optional(),
});

/**
 * Schéma de validation pour l'assignation de tâches
 */
export const assignTaskSchema = z.object({
  assignedUserId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
    .nullable(),
});
