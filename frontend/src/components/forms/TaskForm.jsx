import { useCategories } from '@/hooks/api/useCategories';
import { useProjects } from '@/hooks/api/useProjects';
import { useAuthStore } from '@/store/authStore';
import { formatForInput } from '@/utils/dateUtils';
import { createTaskSchema } from '@/validations/taskValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

export default function TaskForm({ onSubmit, initialData, isLoading, projectId }) {
  const { data: projects = [] } = useProjects();
  const { data: categories = [] } = useCategories();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: initialData ? {
      ...initialData,
      project: initialData.project?._id || initialData.project,
      category: initialData.category?._id || initialData.category,
      assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
      dueDate: initialData.dueDate ? formatForInput(initialData.dueDate) : '',
    } : {
      name: '',
      description: '',
      project: projectId || '',
      category: '',
      assignedTo: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    },
  });

  const projectOptions = projects.map(project => ({
    value: project._id,
    label: project.name,
  }));

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name,
  }));

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Task Name"
        icon={CheckSquare}
        error={errors.name?.message}
        {...register('name')}
        placeholder="e.g., Design homepage mockup"
      />

      <Textarea
        label="Description (Optional)"
        error={errors.description?.message}
        {...register('description')}
        placeholder="Add any additional details..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Project"
          error={errors.project?.message}
          options={projectOptions}
          placeholder="Select a project"
          {...register('project')}
          disabled={!!projectId}
        />

        <Select
          label="Category"
          error={errors.category?.message}
          options={categoryOptions}
          placeholder="Select a category"
          {...register('category')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Status"
          error={errors.status?.message}
          options={statusOptions}
          {...register('status')}
        />

        <Select
          label="Priority"
          error={errors.priority?.message}
          options={priorityOptions}
          {...register('priority')}
        />
      </div>

      <Input
        label="Due Date (Optional)"
        type="date"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
