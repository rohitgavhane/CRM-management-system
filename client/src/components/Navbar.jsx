import React from 'react';
import { Button } from '../components/ui/Button';
import { Menu } from 'lucide-react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, pageTitle }) => {
  return (
    <div className="flex items-center justify-between p-4 h-16 border-b border-border bg-card">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-xl font-semibold ml-4">{pageTitle}</h1>
      </div>

    </div>
  );
};

export default Navbar;
