import api from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch all projects with optional filters
export function useProjects(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const { data } = await api.get(`/projects${queryString ? `?${queryString}` : ''}`);
      return data.data;
    },
  });
}

// Fetch single project with populated data
export function useProject(id) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// Fetch project statistics
export function useProjectStats() {
  return useQuery({
    queryKey: ['projects', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/projects/stats');
      return data.data;
    },
  });
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      // Transform data to match backend requirements
      const payload = {
        ...projectData,
        clientId: projectData.client,
        categoryId: projectData.category,
        startDate: projectData.startDate ? new Date(projectData.startDate).toISOString() : null,
        endDate: projectData.endDate ? new Date(projectData.endDate).toISOString() : null,
      };
      // Remove original fields to avoid confusion/errors (optional but cleaner)
      delete payload.client;
      delete payload.category;

      const { data } = await api.post('/projects', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'stats'] });
    },
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...projectData }) => {
      const { data } = await api.put(`/projects/${id}`, projectData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'stats'] });
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/projects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'stats'] });
    },
  });
}
