import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, type = 'text', value, onChange, placeholder, required = false, children, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      {children || (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      )}
    </div>
  );
};

export default FormField;