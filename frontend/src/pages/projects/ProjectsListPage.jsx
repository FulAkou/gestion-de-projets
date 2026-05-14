import ProjectForm from '@/components/forms/ProjectForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { useCreateProject, useProjects } from '@/hooks/api/useProjects';
import { useToastStore } from '@/store/toastStore';
import { formatDate } from '@/utils/dateUtils';
import { getPriorityConfig, getProjectStatusConfig, getStatusBadgeClasses } from '@/utils/statusHelpers';
import { Filter, FolderKanban, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectsListPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { data: projects = [], isLoading } = useProjects();
  const createMutation = useCreateProject();
  const { success, error } = useToastStore();

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      success('Project created successfully!');
      console.log(data);
      setIsCreateModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create project');
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (statusFilter && project.status !== statusFilter) return false;
    if (priorityFilter && project.priority !== priorityFilter) return false;
    return true;
  });

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
          <FolderKanban className="w-8 h-8 text-primary-600" />
          Projects
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-400" />
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'on_hold', label: 'On Hold' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          containerClassName="w-48"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-5 h-5" />
              Create Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const statusConfig = getProjectStatusConfig(project.status);
            const priorityConfig = getPriorityConfig(project.priority);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {project.name}
                  </h3>
                  <StatusIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className={getStatusBadgeClasses(statusConfig.color)}>
                    {statusConfig.label}
                  </span>
                  <span className={getStatusBadgeClasses(priorityConfig.color)}>
                    {priorityConfig.label}
                  </span>
                </div>

                {project.client && (
                  <p className="text-sm text-gray-500">
                    Client: <span className="font-medium">{project.client.name}</span>
                  </p>
                )}

                {project.endDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {formatDate(project.endDate)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
