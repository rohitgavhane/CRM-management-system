import React from 'react';
import { Select } from '../ui/Select';

const FormSelect = ({ label, name, children, ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground">{label}</label>
      <Select name={name} id={name} {...props}>
        {children}
      </Select>
    </div>
  );
};

export default FormSelect;
