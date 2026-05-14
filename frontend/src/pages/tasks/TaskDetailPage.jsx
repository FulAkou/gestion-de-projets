import TaskForm from '@/components/forms/TaskForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useDeleteTask, useTask, useUpdateTask } from '@/hooks/api/useTasks';
import { useToastStore } from '@/store/toastStore';
import { formatDate } from '@/utils/dateUtils';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  Folder,
  Tag,
  Trash2,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPriorityConfig } from '../../utils/statusHelpers';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: task, isLoading, error: fetchError } = useTask(id);
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const { success, error: toastError } = useToastStore();

  const handleEdit = async (data) => {
    try {
      await updateMutation.mutateAsync({ id, ...data });
      success('Task updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      success('Task deleted successfully!');
      navigate('/tasks');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fetchError || !task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h2>
        <p className="text-gray-600 mb-6">The task you are looking for does not exist.</p>
        <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(task.status);
  const PriorityIcon = AlertCircle; // Or specific priority icon

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary-600" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Task
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {getStatusLabel(task.status)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityConfig(task.priority)}`}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{task.name}</h1>
            
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
              {task.description || <span className="text-gray-400 italic">No description provided.</span>}
            </div>
          </div>

          {/* Activity / Comments Placeholder */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
            <p className="text-gray-500 text-sm">Task activity history will appear here.</p>
          </div> */}
        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="font-semibold text-gray-900 border-b pb-3">Details</h3>
            
            <div className="space-y-4">
              {/* Project */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Project
                </label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Folder className="w-4 h-4 text-gray-400" />
                  {task.projectId?.name || 'Unknown Project'}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {task.categoryId?.name || 'Uncategorized'}
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Assigned To
                </label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <User className="w-4 h-4 text-gray-400" />
                  {task.assignedUserId?.name || 'Unassigned'}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Due Date
                </label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </div>
                {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                   <span className="text-xs text-red-600 font-medium mt-1 inline-block">Overdue</span>
                )}
              </div>

              {/* Created At */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Created
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {formatDate(task.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleEdit}
          initialData={task}
          isLoading={updateMutation.isPending}
          projectId={task.projectId?._id} // Pass project ID if needed contextually
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-900 font-medium">Delete this task?</p>
              <p className="text-red-700 text-sm mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetailPage;
