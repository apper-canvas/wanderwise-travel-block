import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const CategoryChip = ({ category, currency, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="text-center p-4 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors"
    >
      <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}>
        <ApperIcon name={category.icon} size={20} />
      </div>
      <Text as="div" className="!text-sm !font-medium !text-surface-900">{category.name}</Text>
      <Text as="div" className="!text-xs mt-1">
        {currency} {category.total.toLocaleString()}
      </Text>
      <Text as="div" className="!text-xs !text-surface-500">
        {category.count} {category.count === 1 ? 'expense' : 'expenses'}
      </Text>
    </motion.div>
  );
};

export default CategoryChip;