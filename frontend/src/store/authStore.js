import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, accessToken, refreshToken }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          set({
            accessToken: token,
            refreshToken: localStorage.getItem('refreshToken'),
            user: JSON.parse(user),
            isAuthenticated: true,
          });
          return true;
        }
        
        return false;
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user || !user.roles) return false;

        // Check if user has super_admin role
        if (user.roles.some(role => role.name === 'super_admin')) return true;

        // Check permissions
        const permissions = user.roles.flatMap(role => role.permissions || []);
        return permissions.some(p => p.name === permission);
      },

      hasRole: (roleName) => {
        const { user } = get();
        if (!user || !user.roles) return false;
        return user.roles.some(role => role.name === roleName);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
