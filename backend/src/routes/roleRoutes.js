import express from 'express';
import {
    createRole,
    deleteRole,
    getPermissions,
    getRoles,
    updateRole,
} from '../controllers/roleController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware to ensure all routes are protected
router.use(authenticate);

// Permission routes
router.get('/permissions', authorize('view_permissions', 'super_admin'), getPermissions);

// Role routes
router.route('/')
  .get(authorize('view_roles', 'super_admin'), getRoles)
  .post(authorize('create_roles', 'super_admin'), createRole);

router.route('/:id')
  .put(authorize('edit_roles', 'super_admin'), updateRole)
  .delete(authorize('delete_roles', 'super_admin'), deleteRole);

export default router;
