import RoleForm from '@/components/forms/RoleForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCreateRole, useDeleteRole, useRoles, useUpdateRole } from '@/hooks/api/useRoles';
import { useToastStore } from '@/store/toastStore';
import { AlertCircle, Edit2, Plus, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Role = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: roles = [], isLoading } = useRoles();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();
  const { success, error } = useToastStore();

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      success('Role created successfully!');
      setIsCreateModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create role');
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateMutation.mutateAsync({ id: selectedRole._id, ...data });
      success('Role updated successfully!');
      setIsEditModalOpen(false);
      setSelectedRole(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(selectedRole._id);
      success('Role deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-600" />
          Roles & Permissions
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Role
        </Button>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Role Name</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4">Users</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                           {typeof perm === 'object' ? perm.action + ' ' + perm.resource : perm}
                        </span>
                      ))}
                      {role.permissions?.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                      {(!role.permissions || role.permissions.length === 0) && (
                        <span className="text-sm text-gray-400 italic">No permissions</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                     {/* Placeholder for user count if available, mostly likely virtual */}
                     {role.usersCount || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(role)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        disabled={role.name === 'super_admin'}
                        title={role.name === 'super_admin' ? "Cannot edit super_admin" : "Edit"}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(role)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={role.name === 'super_admin'}
                         title={role.name === 'super_admin' ? "Cannot delete super_admin" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No roles found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Role"
        size="lg"
      >
        <RoleForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
        }}
        title="Edit Role"
        size="lg"
      >
        {selectedRole && (
          <RoleForm
            onSubmit={handleEdit}
            initialData={selectedRole}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
        }}
        title="Delete Role"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">
                Are you sure you want to delete this role?
              </p>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. Users with this role might lose access.
              </p>
            </div>
          </div>
          
          {selectedRole && (
            <p className="text-gray-700">
              Role: <strong>{selectedRole.name}</strong>
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedRole(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Role;
