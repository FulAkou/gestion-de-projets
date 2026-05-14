import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
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
  phone: {
    type: String,
    trim: true,
    default: null,
  },
  address: {
    type: String,
    trim: true,
    default: null,
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: 'Status must be either active or inactive',
    },
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required'],
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Updated by user is required'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index pour recherche
// clientSchema.index({ email: 1 }, { unique: true }); // Removed: unnecessary as unique: true in schema creates the index
clientSchema.index({ status: 1 });
clientSchema.index({ name: 'text', email: 'text' });

// Virtual pour les projets du client
clientSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'clientId',
});

// Virtual pour compter les projets
clientSchema.virtual('projectsCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'clientId',
  count: true,
});

// Populate automatiquement le créateur et updateur
clientSchema.pre(/^find/, function(next) {
  this.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'updatedBy', select: 'name email' },
  ]);
  next();
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
