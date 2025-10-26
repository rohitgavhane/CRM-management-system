import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  Users,
  Shield,
  Building,
  Briefcase,
  Package,
} from 'lucide-react';

const Dashboard = () => {
  const { user, useCan } = useAuth();
  const can = useCan();

  const modules = [
    { name: 'Users', module: 'users', icon: Users },
    { name: 'Roles', module: 'roles', icon: Shield },
    { name: 'Enterprises', module: 'enterprises', icon: Building },
    { name: 'Employees', module: 'employees', icon: Briefcase },
    { name: 'Products', module: 'products', icon: Package },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.username}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your role is: <span className="font-semibold text-primary">{user?.role}</span>
        </p>
      </div>

      <h2 className="text-2xl font-semibold">Your Permissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(m => {
          if (!can(m.module, 'read')) return null;
          
          const permissions = user?.permissions?.[m.module] || {};
          return (
            <Card key={m.module}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <m.icon className="text-primary mr-3" size={24} />
                  {m.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(permissions).map(([action, hasAccess]) => (
                    <div key={action} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{action}:</span>
                      {hasAccess ? (
                        <span className="font-medium text-green-400">Allowed</span>
                      ) : (
                        <span className="font-medium text-red-400">Denied</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
