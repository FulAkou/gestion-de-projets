import Category from '../models/Category.js';
import { errorResponse, paginatedResponse, successResponse } from '../utils/responseHandler.js';

/**
 * @route GET /api/categories
 * @desc Get all categories with filters
 * @access Private
 */
export const getCategories = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = {};

    if (type) {
      filter.type = type;
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
    const [categories, total] = await Promise.all([
      Category.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('projectsCount')
        .populate('tasksCount')
        .sort({ createdAt: -1 }),
      Category.countDocuments(filter),
    ]);

    return paginatedResponse(
      res,
      categories,
      parseInt(page),
      parseInt(limit),
      total,
      'Categories retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/categories/:id
 * @desc Get a single category
 * @access Private
 */
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('projectsCount')
      .populate('tasksCount');

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, category, 'Category retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private (requires create_categories permission)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, type, description } = req.body;

    const category = await Category.create({
      name,
      type,
      description,
    });

    return successResponse(
      res,
      category,
      'Category created successfully',
      201
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/categories/:id
 * @desc Update a category
 * @access Private (requires edit_categories permission)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, type, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Update fields
    if (name !== undefined) category.name = name;
    if (type !== undefined) category.type = type;
    if (description !== undefined) category.description = description;

    await category.save();

    return successResponse(res, category, 'Category updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category
 * @access Private (requires delete_categories permission)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    await category.deleteOne();

    return successResponse(res, null, 'Category deleted successfully');

  } catch (error) {
    next(error);
  }
};
