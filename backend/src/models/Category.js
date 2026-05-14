import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: {
      values: ['project', 'task'],
      message: 'Type must be either project or task',
    },
    default: 'project',
  },
  description: {
    type: String,
    trim: true,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index pour recherche et filtre par type
categorySchema.index({ name: 1, type: 1 });
categorySchema.index({ name: 'text', description: 'text' });

// Virtual pour compter les projets
categorySchema.virtual('projectsCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'categoryId',
  count: true,
});

// Virtual pour compter les tâches
categorySchema.virtual('tasksCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'categoryId',
  count: true,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
