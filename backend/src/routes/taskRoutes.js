import express from 'express';
import {
    assignTask,
    createTask,
    deleteTask,
    getMyTasks,
    getTask,
    getTasks,
    updateTask,
} from '../controllers/taskController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/permissionMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
    assignTaskSchema,
    createTaskSchema,
    updateTaskSchema,
} from '../validations/taskValidation.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Special routes must come before /:id
router.get('/my-tasks', getMyTasks);

router.get('/', checkPermission('view_tasks'), getTasks);
router.get('/:id', checkPermission('view_tasks'), getTask);

router.post(
  '/',
  checkPermission('create_tasks'),
  validate(createTaskSchema),
  createTask
);

router.put(
  '/:id',
  checkPermission('edit_tasks'),
  validate(updateTaskSchema),
  updateTask
);

router.patch(
  '/:id/assign',
  checkPermission('edit_tasks'),
  validate(assignTaskSchema),
  assignTask
);

router.delete(
  '/:id',
  checkPermission('delete_tasks'),
  deleteTask
);

export default router;
