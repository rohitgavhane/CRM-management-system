import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import CrudHeader from '../components/common/CrudHeader';
import CrudTable from '../components/common/CrudTable';
import FormInput from '../components/common/FormInput';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';

// Role Form Component
const RoleForm = ({ isOpen, item, modules, onSave, onClose }) => {
  const [formData, setFormData] = useState(item);

  // Ensure form data is updated if item changes
  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePermissionChange = (module, action) => {
    setFormData((prev) => {
      const newPermissions = { ...prev.permissions };
      newPermissions[module] = {
        ...newPermissions[module],
        [action]: !newPermissions[module][action],
      };
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!formData) return null; // Don't render if no item

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item._id ? 'Edit Role' : 'Add Role'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-0">
          <FormInput
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            required
            disabled={formData.name === 'Admin' || formData.name === 'User'}
          />
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {modules.map((module) => (
              <Card key={module} className="bg-muted/50">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg capitalize">{module}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['create', 'read', 'update', 'delete'].map((action) => (
                      <label key={action} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.permissions[module]?.[action] || false}
                          onCheckedChange={() => handlePermissionChange(module, action)}
                          onChange={() => handlePermissionChange(module, action)} // for native
                          disabled={formData.name === 'Admin'}
                        />
                        <span className="capitalize text-sm text-muted-foreground">{action}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formData.name === 'Admin'}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Role Management Page
const RoleManagement = () => {
  const { token, useCan, logout } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const can = {
    create: useCan()('roles', 'create'),
    read: useCan()('roles', 'read'),
    update: useCan()('roles', 'update'),
    delete: useCan()('roles', 'delete'),
  };

  const columns = [{ label: 'Role Name', key: 'name' }];
  const modules = ['users', 'roles', 'enterprises', 'employees', 'products'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.request('GET', '/roles', null, token);
      setRoles(data);
    } catch (err) {
      setError(err.message);
      if (String(err.message).includes('401') || String(err.message).includes('403')) logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAdd = () => {
    const defaultPermissions = {};
    modules.forEach(m => {
      defaultPermissions[m] = { create: false, read: false, update: false, delete: false };
    });
    setCurrentItem({ name: '', permissions: defaultPermissions });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role? This cannot be undone.')) {
      try {
        await api.request('DELETE', `/roles/${id}`, null, token);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  const handleSave = async (item) => {
    try {
      if (item._id) {
        await api.request('PUT', `/roles/${item._id}`, item, token);
      } else {
        await api.request('POST', '/roles', item, token);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading roles...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div>
      <CrudHeader title="Role Management" onAdd={handleAdd} canCreate={can.create} />
      <CrudTable
        columns={columns}
        data={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        can={can}
      />
      <RoleForm
        key={currentItem?._id || 'new'}
        isOpen={isModalOpen}
        item={currentItem}
        modules={modules}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RoleManagement;
