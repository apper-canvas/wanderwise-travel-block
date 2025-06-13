import React from 'react';

const Input = ({ type = 'text', className = '', ...props }) => {
  const inputClass = `w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`;

  return (
    <input
      type={type}
      className={inputClass}
      {...props}
    />
  );
};

export default Input;