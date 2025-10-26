import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import CrudHeader from '../components/common/CrudHeader';
import CrudTable from '../components/common/CrudTable';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import { Button } from '../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';

// User Form Component
const UserForm = ({ isOpen, item, roles, enterprises, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    item || { username: '', email: '', password: '', roleId: '', enterpriseId: '' }
  );

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ 
        username: '', 
        email: '', 
        password: '', 
        roleId: roles.length > 0 ? roles[0]._id : '', 
        enterpriseId: '' 
      });
    }
  }, [item, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
          <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          {!item && (
            <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          )}
          <FormSelect
            label="Role"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
          >
            {roles.map(r => ({ value: r._id, label: r.name })).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FormSelect>
          <FormSelect
            label="Enterprise"
            name="enterpriseId"
            value={formData.enterpriseId || ''}
            onChange={handleChange}
          >
            {[{ value: '', label: 'None' }, ...enterprises.map(e => ({ value: e._id, label: e.name }))].map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FormSelect>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// User Management Page
const UserManagement = () => {
  const { token, useCan, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const can = {
    create: useCan()('users', 'create'),
    read: useCan()('users', 'read'),
    update: useCan()('users', 'update'),
    delete: useCan()('users', 'delete'),
  };

  const columns = [
    { label: 'Username', key: 'username' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role.name' },
    { label: 'Enterprise', key: 'enterprise.name' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, enterprisesData] = await Promise.all([
        api.request('GET', '/users', null, token),
        api.request('GET', '/roles', null, token),
        api.request('GET', '/enterprises', null, token),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setEnterprises(enterprisesData);
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
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    const editItem = {
      ...item,
      roleId: item.role?._id,
      enterpriseId: item.enterprise?._id,
    };
    setCurrentItem(editItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.request('DELETE', `/users/${id}`, null, token);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSave = async (item) => {
    try {
      if (item._id) {
        const { _id, password, ...updateData } = item;
        await api.request('PUT', `/users/${_id}`, updateData, token);
      } else {
        await api.request('POST', '/users', item, token);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div>
      <CrudHeader title="User Management" onAdd={handleAdd} canCreate={can.create} />
      <CrudTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        can={can}
      />
      <UserForm
        key={currentItem?._id || 'new'}
        isOpen={isModalOpen}
        item={currentItem}
        roles={roles}
        enterprises={enterprises}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
