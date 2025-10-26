import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { cn } from '../ui/cn';
import {
  Users,
  Shield,
  Building,
  Briefcase,
  Package,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, currentPage }) => {
  const { user, logout, useCan } = useAuth();
  const can = useCan();

  const navItems = [
    { name: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, module: null, action: null },
    { name: 'users', path: '/users', label: 'Users', icon: Users, module: 'users', action: 'read' },
    { name: 'roles', path: '/roles', label: 'Roles', icon: Shield, module: 'roles', action: 'read' },
    { name: 'enterprises', path: '/enterprises', label: 'Enterprises', icon: Building, module: 'enterprises', action: 'read' },
    { name: 'employees', path: '/employees', label: 'Employees', icon: Briefcase, module: 'employees', action: 'read' },
    { name: 'products', path: '/products', label: 'Products', icon: Package, module: 'products', action: 'read' },
  ];

  const allowedNavItems = navItems.filter(item => {
    if (item.name === 'dashboard') return true;
    return can(item.module, item.action);
  });

  return (
    <nav
      className={cn(
        "bg-card border-r border-border shadow-lg flex flex-col transition-all duration-300",
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex items-center p-4 h-16 border-b border-border">
        <span
          className={cn("font-bold text-xl", !isSidebarOpen && 'hidden')}
        >
          RBAC Panel
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {allowedNavItems.map((item) => (
          <Button
            key={item.name}
            asChild // Use asChild to pass props to Link
            variant={currentPage.startsWith(item.path) ? "secondary" : "ghost"}
            className={cn(
              "flex w-full justify-start px-6 py-4 h-auto text-base",
              !isSidebarOpen && 'justify-center'
            )}
          >
            <Link to={item.path}>
              <item.icon size={20} />
              <span className={cn("ml-4", !isSidebarOpen && 'hidden')}>
                {item.label}
              </span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div
          className={cn("flex items-center", !isSidebarOpen && 'justify-center')}
        >
          <User size={24} />
          <div className={cn("ml-3", !isSidebarOpen && 'hidden')}>
            <p className="text-sm font-medium">
              {user?.username}
            </p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "flex items-center w-full justify-start px-6 py-3 mt-4 h-auto",
            !isSidebarOpen && 'justify-center'
          )}
        >
          <LogOut size={20} />
          <span className={cn("ml-4", !isSidebarOpen && 'hidden')}>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
