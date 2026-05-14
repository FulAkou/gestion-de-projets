import Task from '../models/Task.js';
import { errorResponse, paginatedResponse, successResponse } from '../utils/responseHandler.js';

/**
 * @route GET /api/tasks
 * @desc Get all tasks with filters
 * @access Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, projectId, assignedUserId, categoryId, search, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (assignedUserId) {
      filter.assignedUserId = assignedUserId;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Task.countDocuments(filter),
    ]);

    return paginatedResponse(
      res,
      tasks,
      parseInt(page),
      parseInt(limit),
      total,
      'Tasks retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/tasks/:id
 * @desc Get a single task
 * @access Private
 */
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    return successResponse(res, task, 'Task retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Private (requires create_tasks permission)
 */
export const createTask = async (req, res, next) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      dueDate,
      assignedUserId,
      projectId,
      categoryId,
      imagePath,
    } = req.body;

    const task = await Task.create({
      name,
      description,
      status,
      priority,
      dueDate,
      assignedUserId,
      projectId,
      categoryId,
      imagePath,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    return successResponse(
      res,
      task,
      'Task created successfully',
      201
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/tasks/:id
 * @desc Update a task
 * @access Private (requires edit_tasks permission)
 */
export const updateTask = async (req, res, next) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      dueDate,
      assignedUserId,
      projectId,
      categoryId,
      imagePath,
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Update fields
    if (name !== undefined) task.name = name;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedUserId !== undefined) task.assignedUserId = assignedUserId;
    if (projectId !== undefined) task.projectId = projectId;
    if (categoryId !== undefined) task.categoryId = categoryId;
    if (imagePath !== undefined) task.imagePath = imagePath;

    // Track who updated
    task.updatedBy = req.user._id;

    await task.save();

    return successResponse(res, task, 'Task updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Private (requires delete_tasks permission)
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    await task.deleteOne();

    return successResponse(res, null, 'Task deleted successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/tasks/:id/assign
 * @desc Assign a task to a user
 * @access Private (requires edit_tasks permission)
 */
export const assignTask = async (req, res, next) => {
  try {
    const { assignedUserId } = req.body;
    
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    task.assignedUserId = assignedUserId;
    task.updatedBy = req.user._id;

    await task.save();

    return successResponse(res, task, 'Task assigned successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/tasks/my-tasks
 * @desc Get tasks assigned to current user
 * @access Private
 */
export const getMyTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = {
      assignedUserId: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ dueDate: 1, createdAt: -1 }),
      Task.countDocuments(filter),
    ]);

    return paginatedResponse(
      res,
      tasks,
      parseInt(page),
      parseInt(limit),
      total,
      'My tasks retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};
