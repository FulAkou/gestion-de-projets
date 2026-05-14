import { verifyRefreshToken } from '../config/jwt.js';
import Role from '../models/Role.js';
import User from '../models/User.js';
import { errorResponse, successResponse } from '../utils/responseHandler.js';

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    // Trouver le rôle par défaut (user)
    let userRole = await Role.findOne({ name: 'user' });
    
    // Si le rôle n'existe pas encore, créer un utilisateur sans rôle
    const roles = userRole ? [userRole._id] : [];

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password, // Le password sera hashé automatiquement par le middleware pre-save
      roles,
    });

    // Générer les tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Sauvegarder le refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Recharger l'utilisateur avec les relations pour avoir les rôles peuplés
    const userWithRoles = await User.findById(user._id);

    // Retourner la réponse
    return successResponse(
      res,
      {
        user: userWithRoles.toSafeObject(),
        accessToken,
        refreshToken,
      },
      'User registered successfully',
      201
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur avec le password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Vérifier le password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Générer les tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Sauvegarder le refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Recharger l'utilisateur avec les relations
    const userWithRoles = await User.findById(user._id);

    return successResponse(
      res,
      {
        user: userWithRoles.toSafeObject(),
        accessToken,
        refreshToken,
      },
      'Login successful'
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return errorResponse(res, 'Refresh token is required', 400);
    }

    // Vérifier le refresh token
    try {
      const decoded = verifyRefreshToken(token);

      // Trouver l'utilisateur
      const user = await User.findById(decoded.id).select('+refreshToken');

      if (!user) {
        return errorResponse(res, 'Invalid refresh token', 401);
      }

      // Vérifier que le token correspond à celui stocké
      if (user.refreshToken !== token) {
        return errorResponse(res, 'Invalid refresh token', 401);
      }

      // Générer un nouveau access token
      const newAccessToken = user.generateAuthToken();

      return successResponse(
        res,
        {
          accessToken: newAccessToken,
        },
        'Token refreshed successfully'
      );

    } catch (jwtError) {
      return errorResponse(res, 'Invalid or expired refresh token', 401);
    }

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
export const logout = async (req, res, next) => {
  try {
    const user = req.user;

    // Supprimer le refresh token
    user.refreshToken = null;
    await user.save();

    return successResponse(res, null, 'Logout successful');

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
export const me = async (req, res, next) => {
  try {
    const user = req.user;

    // Charger les permissions
    const permissions = await user.getPermissions();

    return successResponse(
      res,
      {
        user: user.toSafeObject(),
        permissions: permissions.map(p => p.name),
      },
      'User retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};
