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

// Product Form Component
const ProductForm = ({ isOpen, item, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    item || { name: '', price: 0, status: 'In Stock' }
  );

  // Update form data when item changes
  useEffect(() => {
    setFormData(item || { name: '', price: 0, status: 'In Stock' });
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
          <DialogTitle>{item ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
          />
          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
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

// Product Management Page
const ProductManagement = () => {
  const { token, useCan, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const can = {
    create: useCan()('products', 'create'),
    read: useCan()('products', 'read'),
    update: useCan()('products', 'update'),
    delete: useCan()('products', 'delete'),
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Price', key: 'price' },
    { label: 'Status', key: 'status' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.request('GET', '/products', null, token);
      setProducts(data);
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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.request('DELETE', `/products/${id}`, null, token);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSave = async (item) => {
    try {
      if (item._id) {
        await api.request('PUT', `/products/${item._id}`, item, token);
      } else {
        await api.request('POST', '/products', item, token);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div>
      <CrudHeader title="Product Management" onAdd={handleAdd} canCreate={can.create} />
      <CrudTable
        columns={columns}
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        can={can}
      />
      <ProductForm
        key={currentItem?._id || 'new'}
        isOpen={isModalOpen}
        item={currentItem}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductManagement;
