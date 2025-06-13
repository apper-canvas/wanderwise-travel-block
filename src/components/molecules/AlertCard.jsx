import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const AlertCard = ({
  icon,
  iconColorClass = 'text-red-500',
  title,
  message,
  buttonText,
  onButtonClick,
  buttonClass = 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors',
}) => {
  return (
    <div className="p-6 flex items-center justify-center min-h-96">
      <div className="text-center">
        <ApperIcon name={icon} className={`w-12 h-12 ${iconColorClass} mx-auto mb-4`} />
        <Heading level={3} className="!text-lg !font-medium !text-surface-900 mb-2">{title}</Heading>
        <Text className="mb-4">{message}</Text>
        {onButtonClick && (
          <Button onClick={onButtonClick} className={buttonClass}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;