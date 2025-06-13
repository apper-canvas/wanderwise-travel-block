import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const EmptyState = ({
  icon,
  title,
  message,
  buttonText,
  onButtonClick,
  animateIcon = false,
  className = '',
}) => {
  const iconContent = (
    <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto mb-6" />
  );

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-16 ${className}`}
    >
      {animateIcon ? (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          {iconContent}
        </motion.div>
      ) : (
        iconContent
      )}
      <Heading level={3} className="!text-xl !font-medium !text-surface-900 mb-2">{title}</Heading>
      <Text className="mb-6">{message}</Text>
      {onButtonClick && (
        <Button
          onClick={onButtonClick}
          icon="Sparkles"
          className="bg-primary text-white hover:bg-blue-600 hover:scale-105"
        >
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;