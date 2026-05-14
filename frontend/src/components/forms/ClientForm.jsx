import { createClientSchema } from '@/validations/clientValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

export default function ClientForm({ onSubmit, initialData, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      status: 'active',
    },
  });

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          icon={User}
          error={errors.name?.message}
          {...register('name')}
          placeholder="John Doe"
        />

        <Input
          label="Email"
          type="email"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
          placeholder="john@example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone (Optional)"
          type="tel"
          icon={Phone}
          error={errors.phone?.message}
          {...register('phone')}
          placeholder="+1 (555) 000-0000"
        />
        
        <Textarea
          label="Address (Optional)"
          error={errors.address?.message}
          {...register('address')}
          placeholder="123 Main St, City, State, ZIP"
          rows={1}
        />
      </div>



      <Select
        label="Status"
        error={errors.status?.message}
        options={statusOptions}
        {...register('status')}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  );
}
