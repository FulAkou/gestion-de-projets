import ClientForm from '@/components/forms/ClientForm';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import { useClients, useCreateClient, useDeleteClient, useUpdateClient } from '@/hooks/api/useClients';
import { useToastStore } from '@/store/toastStore';
import { AlertCircle, Briefcase, Edit2, Mail, Phone, Plus, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientsListPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: clients = [], isLoading } = useClients();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();
  const { success, error } = useToastStore();

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      success('Client created successfully!');
      setIsCreateModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create client');
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateMutation.mutateAsync({ id: selectedClient._id, ...data });
      success('Client updated successfully!');
      setIsEditModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update client');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(selectedClient._id);
      success('Client deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{client.name}</p>
            {client.company && (
              <p className="text-sm text-gray-500">{client.company}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-2 text-gray-700">
          <Mail className="w-4 h-4 text-gray-400" />
          {client.email}
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (client) =>
        client.phone ? (
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            {client.phone}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (client) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            client.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {client.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (client) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${client._id}`);
            }}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Briefcase className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(client);
            }}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(client);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary-600" />
          Clients
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          icon={Search}
          placeholder="Search clients by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <Table
        columns={columns}
        data={filteredClients}
        onRowClick={(client) => navigate(`/clients/${client._id}`)}
        isLoading={isLoading}
        emptyMessage="No clients found. Create your first client to get started."
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Client"
        size="md"
      >
        <ClientForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        title="Edit Client"
        size="md"
      >
        {selectedClient && (
          <ClientForm
            onSubmit={handleEdit}
            initialData={selectedClient}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        title="Delete Client"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">
                Are you sure you want to delete this client?
              </p>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. All associated projects will also be affected.
              </p>
            </div>
          </div>

          {selectedClient && (
            <p className="text-gray-700">
              Client: <strong>{selectedClient.name}</strong>
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedClient(null);
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
              Delete Client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
