import axios from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Login mutation
 */
export const useLogin = () => {
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post('/auth/login', credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
    },
  });
};

/**
 * Register mutation
 */
export const useRegister = () => {
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post('/auth/register', userData);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
    },
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const logout = useAuthStore(state => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.post('/auth/logout');
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
};

/**
 * Get current user query
 */
export const useMe = () => {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await axios.get('/auth/me');
      return response.data.data;
    },
    enabled: isAuthenticated,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
};
