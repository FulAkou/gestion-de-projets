import express from 'express';
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    getProjectStats,
    updateProject,
} from '../controllers/projectController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/permissionMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
    createProjectSchema,
    updateProjectSchema,
} from '../validations/projectValidation.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Stats route must come before /:id
router.get('/stats', checkPermission('view_projects'), getProjectStats);

router.get('/', checkPermission('view_projects'), getProjects);
router.get('/:id', checkPermission('view_projects'), getProject);

router.post(
  '/',
  checkPermission('create_projects'),
  validate(createProjectSchema),
  createProject
);

router.put(
  '/:id',
  checkPermission('edit_projects'),
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  '/:id',
  checkPermission('delete_projects'),
  deleteProject
);

export default router;
