import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Ne pas retourner le password par défaut dans les queries
  },
  emailVerifiedAt: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index pour la recherche
// userSchema.index({ email: 1 }); // Removed: unnecessary as unique: true in schema creates the index
userSchema.index({ name: 'text', email: 'text' });

// Virtual pour les tâches assignées
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'assignedUserId',
});

// Hash le password avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Seulement hasher si le password a été modifié
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un access token
userSchema.methods.generateAuthToken = function() {
  return generateAccessToken({
    id: this._id,
    email: this.email,
    name: this.name,
  });
};

// Méthode pour générer un refresh token
userSchema.methods.generateRefreshToken = function() {
  return generateRefreshToken({
    id: this._id,
  });
};

// Méthode pour obtenir les permissions de l'utilisateur
userSchema.methods.getPermissions = async function() {
  await this.populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      select: 'name resource action',
    },
  });

  const permissions = [];
  this.roles.forEach(role => {
    role.permissions.forEach(permission => {
      if (!permissions.find(p => p.name === permission.name)) {
        permissions.push(permission);
      }
    });
  });

  return permissions;
};

// Méthode pour vérifier si l'utilisateur a une permission
userSchema.methods.hasPermission = async function(permissionName) {
  const permissions = await this.getPermissions();
  return permissions.some(p => p.name === permissionName);
};

// Méthode pour vérifier si l'utilisateur a un rôle
userSchema.methods.hasRole = function(roleName) {
  return this.roles.some(role => role.name === roleName);
};

// Méthode pour retourner l'objet user sans données sensibles
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

// Populate automatiquement les rôles
userSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'roles',
    select: 'name permissions',
  });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
