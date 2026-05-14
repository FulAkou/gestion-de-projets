import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
  },
  guardName: {
    type: String,
    default: 'web',
    trim: true,
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
  }],
}, {
  timestamps: true,
});

// Index pour la recherche
roleSchema.index({ name: 1, guardName: 1 }, { unique: true });

// Virtual pour compter les utilisateurs ayant ce rôle
roleSchema.virtual('usersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'roles',
  count: true,
});

// Populate automatiquement les permissions
roleSchema.pre(/^find/, function(next) {
  this.populate('permissions', 'name resource action');
  next();
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
