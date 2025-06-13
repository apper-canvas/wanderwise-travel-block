import React from 'react';

const Text = ({ children, className = '', as = 'p', ...props }) => {
  const Tag = as;
  return (
    <Tag className={`text-surface-600 ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Text;