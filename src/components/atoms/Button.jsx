import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ children, icon, iconSize = 16, className = '', disabled, type = 'button', onClick, ...props }) => {
  const buttonClass = `inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={iconSize} />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;