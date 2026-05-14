import Button from '@/components/ui/Button';
import { useMyTasks } from '@/hooks/api/useTasks';
import { formatDate } from '@/utils/dateUtils';
import { AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPriorityConfig } from '../../utils/statusHelpers';

const KanbanColumn = ({ title, tasks, status, count, color }) => {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-100">
      {/* Column Header */}
      <div className={`p-4 border-b border-gray-100 flex items-center justify-between ${color} bg-opacity-10`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium text-gray-500 border border-gray-200 shadow-sm">
            {count}
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <Link
              to={`/tasks/${task._id}`}
              key={task._id}
              className="block bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-primary-200 group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${getPriorityConfig(task.priority)}`}>
                  {task.priority}
                </span>
                {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                   <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" /> Overdue
                   </span>
                )}
              </div>

              <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {task.name}
              </h4>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span className="truncate max-w-[120px]">{task.projectId?.name}</span>
                <span>•</span>
                <span className="truncate max-w-[100px]">{task.categoryId?.name}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {task.dueDate ? formatDate(task.dueDate) : 'No date'}
                </div>
                 {/* Avatar placeholder or assigned user if different */}
                 <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">
                    Me
                 </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default function MyTasksPage() {
  const { data: tasks = [], isLoading, error } = useMyTasks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl">
        <p>Failed to load your tasks. Please try again.</p>
      </div>
    );
  }

  // Group tasks by status
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    on_hold: tasks.filter(t => t.status === 'on_hold'),
    completed: tasks.filter(t => t.status === 'completed'),
    cancelled: tasks.filter(t => t.status === 'cancelled'), // Optional to show
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track your assigned tasks</p>
        </div>
        <Link to="/tasks">
            <Button variant="outline" size="sm">View All Tasks</Button>
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 h-full items-start">
        <KanbanColumn 
          title="To Do" 
          tasks={groupedTasks.pending} 
          count={groupedTasks.pending.length}
          color="bg-gray-100"
          status="pending"
        />
        <KanbanColumn 
          title="In Progress" 
          tasks={groupedTasks.in_progress} 
          count={groupedTasks.in_progress.length}
          color="bg-blue-50"
          status="in_progress"
        />
        <KanbanColumn 
          title="On Hold" 
          tasks={groupedTasks.on_hold} 
          count={groupedTasks.on_hold.length}
          color="bg-yellow-50"
          status="on_hold"
        />
        <KanbanColumn 
          title="Completed" 
          tasks={groupedTasks.completed} 
          count={groupedTasks.completed.length}
          color="bg-green-50"
          status="completed"
        />
      </div>
    </div>
  );
}
