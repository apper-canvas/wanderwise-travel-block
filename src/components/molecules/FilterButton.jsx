import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilterButton = ({ id, name, icon, isActive, onClick }) => {
  return (
    <Button
      key={id}
      onClick={() => onClick(id)}
      icon={icon}
      iconSize={16}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
      }`}
    >
      {name}
    </Button>
  );
};

export default FilterButton;