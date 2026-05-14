import jwt from 'jsonwebtoken';

/**
 * JWT Configuration
 */
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

/**
 * Generate Access Token
 * @param {object} payload - User data to encode
 * @returns {string} JWT token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Generate Refresh Token
 * @param {object} payload - User data to encode
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

/**
 * Verify Access Token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

/**
 * Verify Refresh Token
 * @param {string} token - Refresh token to verify
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshSecret);
};

/**
 * Decode token without verification (useful for debugging)
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
