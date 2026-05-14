import { useProjectStats } from '@/hooks/api/useProjects';
import { useMyTasks } from '@/hooks/api/useTasks';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/dateUtils';
import { getPriorityConfig } from '@/utils/statusHelpers';
import {
  Briefcase,
  Calendar,
  CheckSquare,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StatCard = ({ name, value, icon: Icon, color, isLoading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{name}</p>
        <div className="mt-2 text-3xl font-bold text-gray-900">
          {isLoading ? (
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
             value
          )}
        </div>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    
    // Fetch Data
    const { data: projectData, isLoading: isLoadingProjects } = useProjectStats();
    const { data: myTasks = [], isLoading: isLoadingTasks } = useMyTasks();

    // Calculate Stats
    const totalProjects = projectData?.total || 0;
    
    // Safe access to stats array since backend might return it differently or empty
    const activeProjects = projectData?.stats?.find(s => s._id === 'in_progress')?.count || 0;
    const completedProjects = projectData?.stats?.find(s => s._id === 'completed')?.count || 0;
    
    const pendingTasksCount = myTasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
    const activeTasksCount = myTasks.length;

    // Get recent tasks (limit to 5)
    const recentTasks = [...myTasks]
        .filter(t => t.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate || a.createdAt) - new Date(b.dueDate || b.createdAt))
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-primary-600" />
                    Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                    Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span>! Here's what's happening today.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    name="Total Projects" 
                    value={totalProjects} 
                    icon={FolderKanban} 
                    color="bg-purple-500" 
                    isLoading={isLoadingProjects} 
                />
                <StatCard 
                    name="Active Projects" 
                    value={activeProjects} 
                    icon={Briefcase} 
                    color="bg-blue-500" 
                    isLoading={isLoadingProjects} 
                />
                <StatCard 
                    name="My Pending Tasks" 
                    value={pendingTasksCount} 
                    icon={CheckSquare} 
                    color="bg-orange-500" 
                    isLoading={isLoadingTasks} 
                />
                <StatCard 
                    name="Completed Projects" 
                    value={completedProjects} 
                    icon={CheckSquare} 
                    color="bg-green-500" 
                    isLoading={isLoadingProjects} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Tasks List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Priority Tasks</h2>
                            <Link to="/tasks/my-tasks" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                                View all <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {isLoadingTasks ? (
                                <div className="p-6 text-center text-gray-500">Loading tasks...</div>
                            ) : recentTasks.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-4">
                                        <CheckSquare className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="text-gray-900 font-medium">All caught up!</p>
                                    <p className="text-gray-500 text-sm mt-1">You have no pending tasks assigned.</p>
                                </div>
                            ) : (
                                recentTasks.map(task => {
                                    const priorityConfig = getPriorityConfig(task.priority);
                                    
                                    return (
                                        <div key={task._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 p-1.5 rounded-full ${priorityConfig.color} bg-opacity-20`}>
                                                    <priorityConfig.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <Link to={`/tasks/${task._id}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1 block">
                                                        {task.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <span>{task.projectId?.name || 'No Project'}</span>
                                                        <span>•</span>
                                                        {task.dueDate && (
                                                            <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-red-600 font-medium' : ''}`}>
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(task.dueDate)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`/tasks/${task._id}`}>
                                                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Create</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => navigate('/projects?action=create')}
                                className="p-3 text-left border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                            >
                                <FolderKanban className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700 block">Project</span>
                            </button>
                            <button 
                                onClick={() => navigate('/tasks?action=create')}
                                className="p-3 text-left border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                            >
                                <CheckSquare className="w-6 h-6 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700 block">Task</span>
                            </button>
                            <button 
                                onClick={() => navigate('/clients?action=create')}
                                className="p-3 text-left border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                            >
                                <Users className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700 block">Client</span>
                            </button>
                             <button 
                                onClick={() => navigate('/categories')}
                                className="p-3 text-left border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                            >
                                <Users className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700 block">Category</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Pro Tip 💡</h3>
                            <p className="text-primary-100 text-sm mb-4">
                                Use the <strong>My Tasks</strong> board to drag and drop tasks between statuses and keep organized!
                            </p>
                        
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
