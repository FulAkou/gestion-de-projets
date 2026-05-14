import express from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/permissionMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
    createCategorySchema,
    updateCategorySchema,
} from '../validations/categoryValidation.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post(
  '/',
  checkPermission('create_categories'), 
  validate(createCategorySchema),
  createCategory
);

router.put(
  '/:id',
  checkPermission('edit_categories'),
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  '/:id',
  checkPermission('delete_categories'),
  deleteCategory
);

export default router;
