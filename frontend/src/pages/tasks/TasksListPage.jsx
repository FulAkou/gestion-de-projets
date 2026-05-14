import TaskForm from '@/components/forms/TaskForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import { useCreateTask, useTasks } from '@/hooks/api/useTasks';
import { useToastStore } from '@/store/toastStore';
import { formatDate, isOverdue } from '@/utils/dateUtils';
import { getPriorityConfig, getStatusBadgeClasses, getTaskStatusConfig } from '@/utils/statusHelpers';
import { CheckSquare, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TasksListPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { data: tasks = [], isLoading } = useTasks();
  const createMutation = useCreateTask();
  const { success, error } = useToastStore();

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      success('Task created successfully!');
      setIsCreateModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create task');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Task',
      sortable: true,
      render: (task) => (
        <div>
          <p className="font-medium text-gray-900">{task.name}</p>
          {task.project && (
            <p className="text-sm text-gray-500">{task.project.name}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (task) => {
        const config = getTaskStatusConfig(task.status);
        return (
          <span className={getStatusBadgeClasses(config.color)}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (task) => {
        const config = getPriorityConfig(task.priority);
        return (
          <span className={getStatusBadgeClasses(config.color)}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (task) => task.assignedTo?.name || <span className="text-gray-400">Unassigned</span>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (task) => {
        if (!task.dueDate) return <span className="text-gray-400">-</span>;
        const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
        return (
          <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
            {formatDate(task.dueDate)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-primary-600" />
          Tasks
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-400" />
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'on_hold', label: 'On Hold' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          containerClassName="w-48"
        />
        <Select
          options={[
            { value: '', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          containerClassName="w-48"
        />
      </div>

      {/* Tasks Table */}
      <Table
        columns={columns}
        data={filteredTasks}
        onRowClick={(task) => navigate(`/tasks/${task._id}`)}
        isLoading={isLoading}
        emptyMessage="No tasks found. Create your first task to get started."
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
