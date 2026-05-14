import { z } from 'zod';

/**
 * Schéma de validation pour la création de projets
 */
export const createProjectSchema = z.object({
  name: z.string()
    .min(2, 'Project name must be at least 2 characters')
    .max(200, 'Project name must not exceed 200 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  startDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  endDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  status: z.enum(['pending', 'on_hold', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }).optional(),
  clientId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID'),
  categoryId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

/**
 * Schéma de validation pour la mise à jour de projets
 */
export const updateProjectSchema = z.object({
  name: z.string()
    .min(2, 'Project name must be at least 2 characters')
    .max(200, 'Project name must not exceed 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  startDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  endDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  status: z.enum(['pending', 'on_hold', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }).optional(),
  clientId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID')
    .optional(),
  categoryId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
    .optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});
