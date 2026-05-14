import { ZodError } from 'zod';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Middleware de gestion des erreurs global
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message,
    }));

    return errorResponse(res, 'Validation failed', 422, errors);
  }

  // Erreur de cast Mongoose (mauvais format d'ID)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // Erreur de duplication (clé unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(
      res,
      `${field} already exists`,
      409,
      [{ field, message: `This ${field} is already in use` }]
    );
  }

  // Erreur Zod
  if (err instanceof ZodError) {
    const errors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    return errorResponse(res, 'Validation failed', 422, errors);
  }

  // Erreur JWT  
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};

/**
 * Middleware pour gérer les routes non trouvées
 */
export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
