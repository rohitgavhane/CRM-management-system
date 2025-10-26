import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import CrudHeader from '../components/common/CrudHeader';
import CrudTable from '../components/common/CrudTable';
import FormInput from '../components/common/FormInput';
import { Button } from '../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';

// Enterprise Form Component
const EnterpriseForm = ({ isOpen, item, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    item || { name: '', location: '', contactInfo: '' }
  );

  useEffect(() => {
    setFormData(item || { name: '', location: '', contactInfo: '' });
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
          <DialogTitle>{item ? 'Edit Enterprise' : 'Add Enterprise'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Location" name="location" value={formData.location} onChange={handleChange} />
          <FormInput label="Contact Info" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
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

// Enterprise Management Page
const EnterpriseManagement = () => {
  const { token, useCan, logout } = useAuth();
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const can = {
    create: useCan()('enterprises', 'create'),
    read: useCan()('enterprises', 'read'),
    update: useCan()('enterprises', 'update'),
    delete: useCan()('enterprises', 'delete'),
  };
  
  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Location', key: 'location' },
    { label: 'Contact Info', key: 'contactInfo' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.request('GET', '/enterprises', null, token);
      setEnterprises(data);
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
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enterprise?')) {
      try {
        await api.request('DELETE', `/enterprises/${id}`, null, token);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSave = async (item) => {
    try {
      if (item._id) {
        await api.request('PUT', `/enterprises/${item._id}`, item, token);
      } else {
        await api.request('POST', '/enterprises', item, token);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading enterprises...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div>
      <CrudHeader title="Enterprise Management" onAdd={handleAdd} canCreate={can.create} />
      <CrudTable
        columns={columns}
        data={enterprises}
        onEdit={handleEdit}
        onDelete={handleDelete}
        can={can}
      />
      <EnterpriseForm
        key={currentItem?._id || 'new'}
        isOpen={isModalOpen}
        item={currentItem}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EnterpriseManagement;
