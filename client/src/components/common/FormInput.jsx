import React from 'react';
import { Input } from '../ui/Input';

const FormInput = ({ label, name, ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground">{label}</label>
      <Input name={name} id={name} {...props} />
    </div>
  );
};

export default FormInput;
