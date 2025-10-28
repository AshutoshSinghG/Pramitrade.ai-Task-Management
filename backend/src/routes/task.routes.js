import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task CRUD endpoints
 */

router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').isString().isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed'])
  ],
  createTask
);

router.get('/', getTasks);

router.get('/:id', [param('id').isMongoId()], getTaskById);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 1 }),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed'])
  ],
  updateTask
);

router.delete('/:id', [param('id').isMongoId()], deleteTask);

export default router;


