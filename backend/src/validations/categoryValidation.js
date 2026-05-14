import { z } from 'zod';

/**
 * Schéma de validation pour la création de catégories
 */
export const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters')
    .trim(),
  type: z.enum(['project', 'task'], {
    errorMap: () => ({ message: 'Type must be either project or task' }),
  }),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
});

/**
 * Schéma de validation pour la mise à jour de catégories
 */
export const updateCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters')
    .trim()
    .optional(),
  type: z.enum(['project', 'task'], {
    errorMap: () => ({ message: 'Type must be either project or task' }),
  }).optional(),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
});
