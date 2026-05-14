import { verifyAccessToken } from '../config/jwt.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Middleware d'authentification JWT
 * Vérifie le token et charge l'utilisateur dans req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Authentication token missing', 401);
    }

    try {
      // Vérifier et décoder le token
      const decoded = verifyAccessToken(token);

      // Charger l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('+refreshToken');

      if (!user) {
        return errorResponse(res, 'User not found', 401);
      }

      // Attacher l'utilisateur à la requête
      req.user = user;
      next();

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
      }
      throw jwtError;
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Middleware optionnel d'authentification
 * Charge l'utilisateur si un token est présent, mais n'échoue pas si absent
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = user;
      }
    } catch (jwtError) {
      // Ignorer les erreurs de token pour auth optionnelle
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Middleware d'autorisation
 * @param {...String} requiredPermissions - Permissions requises (OR) ou nom de rôles spéciaux
 */
export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      // Check for super_admin role
      const hasSuperAdmin = req.user.roles?.some(role => role.name === 'super_admin');
      if (hasSuperAdmin) {
        return next();
      }

      // If no permissions required, pass
      if (requiredPermissions.length === 0) {
        return next();
      }

      // Collect all user permissions
      const userPermissions = new Set();
      req.user.roles?.forEach(role => {
        role.permissions?.forEach(perm => {
           // Handle both populated objects and ID strings (though controllers should populate)
           if (typeof perm === 'object') {
             userPermissions.add(perm.name);
           }
        });
        userPermissions.add(role.name); // Also add role names to checking set
      });

      // Check if user has at least one of the required permissions/roles
      // Note: This implements an OR logic for the arguments passed to authorize()
      // e.g., authorize('manage_roles', 'super_admin') means usually ANY is fine
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.has(permission)
      );

      if (!hasPermission) {
        return errorResponse(res, 'Unauthorized access', 403);
      }

      next();
    } catch (error) {
       console.error('Authorization error:', error);
       return errorResponse(res, 'Authorization failed', 500);
    }
  };
};
