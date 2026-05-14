import { errorResponse } from '../utils/responseHandler.js';

/**
 * Middleware pour vérifier si l'utilisateur a une permission spécifique
 * @param {string} permissionName - Nom de la permission requise
 * @returns {function} Express middleware
 */
export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Authentication required', 401);
      }

      // Vérifier si l'utilisateur a la permission
      const hasPermission = await req.user.hasPermission(permissionName);

      if (!hasPermission) {
        return errorResponse(
          res,
          `Permission denied. Required permission: ${permissionName}`,
          403
        );
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return errorResponse(res, 'Permission check failed', 500);
    }
  };
};

/**
 * Middleware pour vérifier si l'utilisateur a un rôle spécifique
 * @param {string|string[]} roleNames - Nom(s) du/des rôle(s) requis
 * @returns {function} Express middleware
 */
export const checkRole = (roleNames) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Authentication required', 401);
      }

      const roles = Array.isArray(roleNames) ? roleNames : [roleNames];

      // Vérifier si l'utilisateur a au moins un des rôles requis
      const hasRole = roles.some(roleName => req.user.hasRole(roleName));

      if (!hasRole) {
        return errorResponse(
          res,
          `Access denied. Required role(s): ${roles.join(', ')}`,
          403
        );
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return errorResponse(res, 'Role check failed', 500);
    }
  };
};

/**
 * Middleware pour vérifier si l'utilisateur est le propriétaire de la ressource
 * ou a les permissions nécessaires
 * @param {string} resourceModel - Nom du modèle de la ressource
 * @param {string} ownerField - Nom du champ contenant l'ID du propriétaire
 * @returns {function} Express middleware
 */
export const checkOwnership = (resourceModel, ownerField = 'createdBy') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Authentication required', 401);
      }

      const resourceId = req.params.id;

      // Dynamiquement importer le modèle
      const Model = (await import(`../models/${resourceModel}.js`)).default;

      // Trouver la ressource
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return errorResponse(res, 'Resource not found', 404);
      }

      // Vérifier si l'utilisateur est le propriétaire
      const isOwner = resource[ownerField]?.toString() === req.user._id.toString();

      // Vérifier si l'utilisateur a le rôle admin
      const isAdmin = req.user.hasRole('super_admin') || req.user.hasRole('admin');

      if (!isOwner && !isAdmin) {
        return errorResponse(
          res,
          'You do not have permission to access this resource',
          403
        );
      }

      // Attacher la ressource à la requête pour éviter une double lecture
      req.resource = resource;
      next();

    } catch (error) {
      console.error('Ownership check error:', error);
      return errorResponse(res, 'Ownership check failed', 500);
    }
  };
};

/**
 * Middleware pour vérifier si l'utilisateur peut modifier une ressource
 * Soit il est le propriétaire, soit il a la permission d'édition
 * @param {string} editPermission - Nom de la permission d'édition
 * @param {string} ownerField - Nom du champ contenant l'ID du propriétaire
 * @returns {function} Express middleware
 */
export const canModify = (editPermission, ownerField = 'createdBy') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Authentication required', 401);
      }

      // Si la ressource est déjà attachée (par checkOwnership)
      if (req.resource) {
        const isOwner = req.resource[ownerField]?.toString() === req.user._id.toString();
        const hasPermission = await req.user.hasPermission(editPermission);

        if (!isOwner && !hasPermission) {
          return errorResponse(res, 'You do not have permission to modify this resource', 403);
        }

        return next();
      }

      // Sinon, vérifier juste la permission globale
      const hasPermission = await req.user.hasPermission(editPermission);

      if (!hasPermission) {
        return errorResponse(res, `Permission denied. Required permission: ${editPermission}`, 403);
      }

      next();

    } catch (error) {
      console.error('Modification permission check error:', error);
      return errorResponse(res, 'Permission check failed', 500);
    }
  };
};
