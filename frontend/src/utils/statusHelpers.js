import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    CheckCircle,
    Circle,
    Clock,
    Minus,
    PauseCircle,
    PlayCircle
} from 'lucide-react';

// Project Status
export const projectStatuses = {
  planning: { label: 'Planning', color: 'bg-blue-100 text-blue-800', icon: Circle },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: PlayCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'on-hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800', icon: PauseCircle },
};

export function getProjectStatusConfig(status) {
  return projectStatuses[status] || projectStatuses.planning;
}

// Task Status
export const taskStatuses = {
  'to-do': { label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: Circle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: PlayCircle },
  'in-review': { label: 'In Review', color: 'bg-purple-100 text-purple-800', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

export function getTaskStatusConfig(status) {
  return taskStatuses[status] || taskStatuses['to-do'];
}

// Priority
export const priorities = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800', icon: ArrowDown },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800', icon: Minus },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800', icon: ArrowUp },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export function getPriorityConfig(priority) {
  return priorities[priority] || priorities.medium;
}

// Status Badge Component Helper
export function getStatusBadgeClasses(colorClasses) {
  return `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorClasses}`;
}
