import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .optional()
    .or(z.literal('')),

  address: z.string()
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive'])
    .default('active'),
});

export const updateClientSchema = createClientSchema.partial();
