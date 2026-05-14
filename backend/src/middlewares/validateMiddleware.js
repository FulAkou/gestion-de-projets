import { ZodError } from 'zod';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Middleware de validation avec Zod
 * @param {object} schema - Schéma Zod pour validation
 * @returns {function} Express middleware
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Valider le body de la requête
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formater les erreurs Zod
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        console.log('Validation Errors:', JSON.stringify(errors, null, 2));
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        return errorResponse(res, 'Validation failed', 422, errors);
      }
      next(error);
    }
  };
};

/**
 * Middleware de validation pour les paramètres d'URL
 * @param {object} schema - Schéma Zod pour validation
 * @returns {function} Express middleware
 */
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return errorResponse(res, 'Invalid parameters', 422, errors);
      }
      next(error);
    }
  };
};

/**
 * Middleware de validation pour les query params
 * @param {object} schema - Schéma Zod pour validation
 * @returns {function} Express middleware
 */
export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return errorResponse(res, 'Invalid query parameters', 422, errors);
      }
      next(error);
    }
  };
};
