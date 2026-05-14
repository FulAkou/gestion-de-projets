import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Permission name is required'],
    unique: true,
    trim: true,
  },
  guardName: {
    type: String,
    default: 'web',
    trim: true,
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    trim: true,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: ['view', 'create', 'edit', 'delete'],
  },
}, {
  timestamps: true,
});

// Index pour la recherche
permissionSchema.index({ name: 1, guardName: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
