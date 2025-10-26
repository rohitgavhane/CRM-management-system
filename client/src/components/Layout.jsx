import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../components/ui/cn';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        currentPage={location.pathname}
      />
      <div className="flex-1 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          pageTitle={getPageTitle()}
        />
        <main className={cn("flex-1 overflow-y-auto p-8")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
