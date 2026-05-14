import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
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
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be one of: low, medium, high',
    },
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  assignedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required'],
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
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedUserId: 1 });
taskSchema.index({ categoryId: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ name: 'text', description: 'text' });

// Méthode pour vérifier si la tâche est en retard
taskSchema.methods.isOverdue = function() {
  if (!this.dueDate) return false;
  return this.dueDate < new Date() && this.status !== 'completed';
};

// Virtual pour obtenir le statut de retard
taskSchema.virtual('overdue').get(function() {
  return this.isOverdue();
});

// Populate automatiquement les relations
taskSchema.pre(/^find/, function(next) {
  this.populate([
    { path: 'projectId', select: 'name status' },
    { path: 'categoryId', select: 'name type' },
    { path: 'assignedUserId', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
    { path: 'updatedBy', select: 'name email' },
  ]);
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
