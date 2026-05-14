import Permission from '../models/Permission.js';
import Role from '../models/Role.js';

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate('permissions')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private/Admin
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ resource: 1, action: 1 });
    res.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private/Admin
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      return res.status(400).json({
        success: false,
        message: 'Role already exists',
      });
    }

    const role = await Role.create({
      name,
      permissions,
    });

    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.status(201).json({
      success: true,
      data: populatedRole,
      message: 'Role created successfully',
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
export const updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    if (role.name === 'super_admin' && name !== 'super_admin') {
         return res.status(400).json({
        success: false,
        message: 'Cannot change name of super_admin role',
      });
    }

    role.name = name || role.name;
    role.permissions = permissions || role.permissions;

    const updatedRole = await role.save();
    await updatedRole.populate('permissions');

    res.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully',
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    if (role.name === 'super_admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete super_admin role',
      });
    }

    await role.deleteOne();

    res.json({
      success: true,
      data: {},
      message: 'Role deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
