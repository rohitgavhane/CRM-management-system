import React from 'react';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

const CrudHeader = ({ title, onAdd, canCreate }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {canCreate && (
        <Button onClick={onAdd}>
          <Plus size={20} className="mr-2" />
          Add New
        </Button>
      )}
    </div>
  );
};

export default CrudHeader;
