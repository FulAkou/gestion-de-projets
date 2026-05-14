import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { usePermissions } from '@/hooks/api/useRoles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Role name is required'),
  permissions: z.array(z.string()).optional(),
});

const RoleForm = ({ onSubmit, initialData, isLoading }) => {
  const { data: permissions = [] } = usePermissions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const selectedPermissions = watch('permissions');

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      // Map permission objects to their IDs if initialData has populated permissions
      const permissionIds = initialData.permissions?.map(p => typeof p === 'object' ? p._id : p) || [];
      setValue('permissions', permissionIds);
    }
  }, [initialData, setValue]);

  const handlePermissionChange = (permissionId) => {
    const current = selectedPermissions || [];
    const updated = current.includes(permissionId)
      ? current.filter(id => id !== permissionId)
      : [...current, permissionId];
    setValue('permissions', updated);
  };

  // Group permissions by resource for better display
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const resource = perm.resource;
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(perm);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Role Name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Permissions</label>
        <div className="h-64 overflow-y-auto border rounded-md p-4 space-y-4">
          {Object.entries(groupedPermissions).map(([resource, perms]) => (
            <div key={resource}>
              <h4 className="font-medium text-gray-900 capitalize mb-2">{resource}</h4>
              <div className="grid grid-cols-2 gap-2">
                {perms.map((perm) => (
                  <label key={perm._id} className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      value={perm._id}
                      checked={selectedPermissions?.includes(perm._id)}
                      onChange={() => handlePermissionChange(perm._id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    {perm.action}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
