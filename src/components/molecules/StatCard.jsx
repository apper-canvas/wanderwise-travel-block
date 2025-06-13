import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatCard = ({
  title,
  value,
  icon,
  iconColorClass = 'text-blue-100',
  bgColorClass = 'bg-gradient-to-r from-blue-500 to-primary',
  valueClass = 'text-2xl font-bold',
  description,
  descriptionColorClass = 'text-blue-100',
  animate = false,
  delay = 0
}) => {
  const content = (
    <div className={`rounded-lg p-6 shadow-lg ${bgColorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <Text as="p" className={`text-sm font-medium ${descriptionColorClass}`}>{title}</Text>
          <p className={`${valueClass} text-white break-words`}>{value}</p>
        </div>
        <ApperIcon name={icon} className={`w-8 h-8 ${iconColorClass}`} />
      </div>
      {description && (
        <Text as="p" className={`text-sm mt-1 ${descriptionColorClass}`}>{description}</Text>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default StatCard;