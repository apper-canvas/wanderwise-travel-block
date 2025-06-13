import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = false, animate = false, delay = 0, ...props }) => {
  const baseClass = `bg-white rounded-lg shadow-sm border border-surface-200 ${className}`;
  const hoverClass = hoverEffect ? 'hover:shadow-md transition-all' : '';

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`${baseClass} ${hoverClass}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClass} ${hoverClass}`} {...props}>
      {children}
    </div>
  );
};

export default Card;