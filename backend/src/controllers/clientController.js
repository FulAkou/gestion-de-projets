import Client from '../models/Client.js';
import { errorResponse, paginatedResponse, successResponse } from '../utils/responseHandler.js';

/**
 * @route GET /api/clients
 * @desc Get all clients with filters
 * @access Private
 */
export const getClients = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [clients, total] = await Promise.all([
      Client.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('projectsCount')
        .sort({ createdAt: -1 }),
      Client.countDocuments(filter),
    ]);

    return paginatedResponse(
      res,
      clients,
      parseInt(page),
      parseInt(limit),
      total,
      'Clients retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/clients/:id
 * @desc Get a single client
 * @access Private
 */
export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate({
        path: 'projects',
        select: 'name status startDate endDate',
      })
      .populate('projectsCount');

    if (!client) {
      return errorResponse(res, 'Client not found', 404);
    }

    return successResponse(res, client, 'Client retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/clients
 * @desc Create a new client
 * @access Private (requires create_clients permission)
 */
export const createClient = async (req, res, next) => {
  try {
    const { name, email, phone, address, status } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      address,
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    return successResponse(
      res,
      client,
      'Client created successfully',
      201
    );

  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/clients/:id
 * @desc Update a client
 * @access Private (requires edit_clients permission)
 */
export const updateClient = async (req, res, next) => {
  try {
    const { name, email, phone, address, status } = req.body;

    const client = await Client.findById(req.params.id);

    if (!client) {
      return errorResponse(res, 'Client not found', 404);
    }

    // Update fields
    if (name !== undefined) client.name = name;
    if (email !== undefined) client.email = email;
    if (phone !== undefined) client.phone = phone;
    if (address !== undefined) client.address = address;
    if (status !== undefined) client.status = status;

    // Track who updated
    client.updatedBy = req.user._id;

    await client.save();

    return successResponse(res, client, 'Client updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/clients/:id
 * @desc Delete a client
 * @access Private (requires delete_clients permission)
 */
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return errorResponse(res, 'Client not found', 404);
    }

    await client.deleteOne();

    return successResponse(res, null, 'Client deleted successfully');

  } catch (error) {
    next(error);
  }
};
