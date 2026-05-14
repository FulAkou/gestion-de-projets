import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: null,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  imagePath: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'on_hold', 'in_progress', 'completed', 'cancelled'],
      message: 'Status must be one of: pending, on_hold, in_progress, completed, cancelled',
    },
    default: 'pending',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required'],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
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

// Index pour recherche et filtres
projectSchema.index({ status: 1 });
projectSchema.index({ clientId: 1 });
projectSchema.index({ categoryId: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });
projectSchema.index({ name: 'text', description: 'text' });

// Virtual pour les tâches du projet
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
});

// Virtual pour compter les tâches
projectSchema.virtual('tasksCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
  count: true,
});

// Virtual pour compter les tâches complétées
projectSchema.virtual('completedTasksCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
  match: { status: 'completed' },
  count: true,
});

// Méthode pour calculer le pourcentage de progression
projectSchema.methods.getProgress = async function() {
  const Task = mongoose.model('Task');
  const totalTasks = await Task.countDocuments({ projectId: this._id });
  const completedTasks = await Task.countDocuments({ 
    projectId: this._id, 
    status: 'completed' 
  });

  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

// Populate automatiquement les relations
projectSchema.pre(/^find/, function(next) {
  this.populate([
    { path: 'clientId', select: 'name email status' },
    { path: 'categoryId', select: 'name type' },
    { path: 'createdBy', select: 'name email' },
    { path: 'updatedBy', select: 'name email' },
  ]);
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
