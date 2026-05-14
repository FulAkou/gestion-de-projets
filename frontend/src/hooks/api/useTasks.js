import api from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch all tasks with optional filters
export function useTasks(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const { data } = await api.get(`/tasks${queryString ? `?${queryString}` : ''}`);
      return data.data;
    },
  });
}

// Fetch current user's tasks
export function useMyTasks() {
  return useQuery({
    queryKey: ['tasks', 'my-tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks/my-tasks');
      return data.data;
    },
  });
}

// Fetch single task
export function useTask(id) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// Create task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      // Transform data to match backend requirements
      const payload = {
        ...taskData,
        projectId: taskData.project,
        categoryId: taskData.category,
        assignedUserId: taskData.assignedTo || null,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      };
      // Remove original fields
      delete payload.project;
      delete payload.category;
      delete payload.assignedTo;

      const { data } = await api.post('/tasks', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Update task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...taskData }) => {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Delete task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Assign task to user
export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const { data } = await api.patch(`/tasks/${id}/assign`, { assignedTo: userId });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
}
