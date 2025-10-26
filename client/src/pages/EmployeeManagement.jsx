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

// Employee Form Component
const EmployeeForm = ({ isOpen, item, enterprises, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    item || { name: '', department: '', salary: 0, enterprise: '' }
  );

  useEffect(() => {
    if (item) {
        setFormData(item);
    } else {
        setFormData({ name: '', department: '', salary: 0, enterprise: '' });
    }
  }, [item]);

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
          <DialogTitle>{item ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} />
          <FormInput label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
          <FormSelect
            label="Enterprise"
            name="enterprise"
            value={formData.enterprise || ''}
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

// Employee Management Page
const EmployeeManagement = () => {
  const { token, useCan, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const can = {
    create: useCan()('employees', 'create'),
    read: useCan()('employees', 'read'),
    update: useCan()('employees', 'update'),
    delete: useCan()('employees', 'delete'),
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Department', key: 'department' },
    { label: 'Salary', key: 'salary' },
    { label: 'Enterprise', key: 'enterprise.name' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, enterprisesData] = await Promise.all([
        api.request('GET', '/employees', null, token),
        api.request('GET', '/enterprises', null, token),
      ]);
      setEmployees(employeesData);
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
    setCurrentItem({ ...item, enterprise: item.enterprise?._id });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.request('DELETE', `/employees/${id}`, null, token);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSave = async (item) => {
    try {
      if (item._id) {
        await api.request('PUT', `/employees/${item._id}`, item, token);
      } else {
        await api.request('POST', '/employees', item, token);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (loading) return <div>Loading employees...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div>
      <CrudHeader title="Employee Management" onAdd={handleAdd} canCreate={can.create} />
      <CrudTable
        columns={columns}
        data={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        can={can}
      />
      <EmployeeForm
        key={currentItem?._id || 'new'}
        isOpen={isModalOpen}
        item={currentItem}
        enterprises={enterprises}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EmployeeManagement;
