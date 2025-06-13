import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Heading level={3} className="!text-lg !font-semibold !text-surface-900">{title}</Heading>
          <button
            onClick={onClose}
            className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;