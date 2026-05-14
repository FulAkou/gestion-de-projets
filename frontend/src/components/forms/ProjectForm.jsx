import { useCategories } from '@/hooks/api/useCategories';
import { useClients } from '@/hooks/api/useClients';
import { formatForInput } from '@/utils/dateUtils';
import { createProjectSchema } from '@/validations/projectValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderKanban } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

export default function ProjectForm({ onSubmit, initialData, isLoading }) {
  const { data: clients = [] } = useClients();
  const { data: categories = [] } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: initialData ? {
      ...initialData,
      client: initialData.client?._id || initialData.client,
      startDate: initialData.startDate ? formatForInput(initialData.startDate) : '',
      endDate: initialData.endDate ? formatForInput(initialData.endDate) : '',
    } : {
      name: '',
      description: '',
      client: '',
      category: '',
      status: 'pending',
      startDate: '',
      endDate: '',
    },
  });

  const clientOptions = clients.map(client => ({
    value: client._id,
    label: client.name,
  }));

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name,
  }));

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Project Name"
        icon={FolderKanban}
        error={errors.name?.message}
        {...register('name')}
        placeholder="e.g., Website Redesign"
      />

      <Textarea
        label="Description"
        error={errors.description?.message}
        {...register('description')}
        placeholder="Describe the project goals and deliverables..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Client"
          error={errors.client?.message}
          options={clientOptions}
          placeholder="Select a client"
          {...register('client')}
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

        <Input
          label="Start Date (Optional)"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="End Date (Optional)"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>



      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
