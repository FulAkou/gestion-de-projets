import { z } from 'zod';

/**
 * Schéma de validation pour la création de clients
 */
export const createClientSchema = z.object({
  name: z.string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name must not exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  phone: z.string()
    .min(8, 'Phone must be at least 8 characters')
    .max(20, 'Phone must not exceed 20 characters')
    .trim()
    .optional()
    .nullable(),
  address: z.string()
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Status must be either active or inactive' }),
  }).optional(),
});

/**
 * Schéma de validation pour la mise à jour de clients
 */
export const updateClientSchema = z.object({
  name: z.string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name must not exceed 100 characters')
    .trim()
    .optional(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim()
    .optional(),
  phone: z.string()
    .min(8, 'Phone must be at least 8 characters')
    .max(20, 'Phone must not exceed 20 characters')
    .trim()
    .optional()
    .nullable(),
  address: z.string()
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Status must be either active or inactive' }),
  }).optional(),
});
