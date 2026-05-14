import Project from '../models/Project.js';
import { errorResponse, paginatedResponse, successResponse } from '../utils/responseHandler.js';

/**
 * @route GET /api/projects
 * @desc Get all projects with filters
 * @access Private
 */
export const getProjects = async (req, res, next) => {
  try {
    const { status, clientId, categoryId, search, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (clientId) {
      filter.clientId = clientId;
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
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('tasksCount')
        .populate('completedTasksCount')
        .sort({ createdAt: -1 }),
      Project.countDocuments(filter),
    ]);

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progress = await project.getProgress();
        return {
          ...project.toObject(),
          progress,
        };
      })
    );

    return paginatedResponse(
      res,
      projectsWithProgress,
      parseInt(page),
      parseInt(limit),
      total,
      'Projects retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/projects/:id
 * @desc Get a single project
 * @access Private
 */
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'tasks',
        select: 'name status priority dueDate assignedUserId',
        populate: {
          path: 'assignedUserId',
          select: 'name email',
        },
      })
      .populate('tasksCount')
      .populate('completedTasksCount');

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    const progress = await project.getProgress();

    return successResponse(
      res,
      {
        ...project.toObject(),
        progress,
      },
      'Project retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Private (requires create_projects permission)
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, status, clientId, categoryId, imagePath } = req.body;

    const project = await Project.create({
      name,
      description,
      startDate,
      endDate,
      status,
      clientId,
      categoryId,
      imagePath,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    return successResponse(
      res,
      project,
      'Project created successfully',
      201
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/projects/:id
 * @desc Update a project
 * @access Private (requires edit_projects permission)
 */
export const updateProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, status, clientId, categoryId, imagePath } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Update fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (status !== undefined) project.status = status;
    if (clientId !== undefined) project.clientId = clientId;
    if (categoryId !== undefined) project.categoryId = categoryId;
    if (imagePath !== undefined) project.imagePath = imagePath;

    // Track who updated
    project.updatedBy = req.user._id;

    await project.save();

    return successResponse(res, project, 'Project updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project
 * @access Private (requires delete_projects permission)
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    await project.deleteOne();

    return successResponse(res, null, 'Project deleted successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/projects/stats
 * @desc Get project statistics
 * @access Private
 */
export const getProjectStats = async (req, res, next) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Project.countDocuments();

    return successResponse(
      res,
      {
        stats,
        total,
      },
      'Project statistics retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};
