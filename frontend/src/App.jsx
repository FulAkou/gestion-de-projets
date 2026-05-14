import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';
import { queryClient } from './lib/queryClient';
import { useAuthStore } from './store/authStore';
import { useToastStore } from './store/toastStore';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';


// Main Pages
import CategoriesPage from './pages/categories/CategoriesPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import ClientsListPage from './pages/clients/ClientsListPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProjectsListPage from './pages/projects/ProjectsListPage';
import Role from './pages/roles/Role';
import MyTasksPage from './pages/tasks/MyTasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import TasksListPage from './pages/tasks/TasksListPage';


function App() {
  const { checkAuth } = useAuthStore();
  const { toasts, removeToast } = useToastStore();

  // Check auth on app load
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />


          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            <Route path="categories" element={<CategoriesPage />} />
            <Route 
              path="roles" 
              element={
                <ProtectedRoute requiredPermission="view_roles">
                  <Role />
                </ProtectedRoute>
              } 
            />

            
            <Route path="clients" element={<ClientsListPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            
            <Route path="projects" element={<ProjectsListPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            
            <Route path="tasks" element={<TasksListPage />} />
            <Route path="tasks/my-tasks" element={<MyTasksPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </QueryClientProvider>
  );
}

export default App;
