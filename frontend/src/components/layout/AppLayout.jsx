import { useLogout } from '@/hooks/api/useAuth';
import { useAuthStore } from '@/store/authStore';
import {
  Briefcase, CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut, Menu,
  Shield,
  Users,
  X
} from 'lucide-react';

import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AppLayout = () => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Roles', href: '/roles', icon: Shield },
    { name: 'Categories', href: '/categories', icon: FolderKanban },

    { name: 'Clients', href: '/clients', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'My Tasks', href: '/tasks/my-tasks', icon: CheckSquare },
  ];

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">MGT App</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navigation.filter(item => {
              // Safety check for user and roles
              if (!user?.roles) return true;
              
              if (item.name === 'Roles') {
                const hasSuperAdmin = user.roles.some(r => r?.name === 'super_admin');
                const hasViewPerm = user.roles.some(r => r?.permissions?.some(p => p?.name === 'view_roles'));
                
                if (!hasSuperAdmin && !hasViewPerm) {
                  return false;
                }
              }
              return true;
            }).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Project Management</h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
