import express from 'express';
import {
    createClient,
    deleteClient,
    getClient,
    getClients,
    updateClient,
} from '../controllers/clientController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/permissionMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
    createClientSchema,
    updateClientSchema,
} from '../validations/clientValidation.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/', checkPermission('view_clients'), getClients);
router.get('/:id', checkPermission('view_clients'), getClient);

router.post(
  '/',
  checkPermission('create_clients'),
  validate(createClientSchema),
  createClient
);

router.put(
  '/:id',
  checkPermission('edit_clients'),
  validate(updateClientSchema),
  updateClient
);

router.delete(
  '/:id',
  checkPermission('delete_clients'),
  deleteClient
);

export default router;
