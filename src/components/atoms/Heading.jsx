import React from 'react';

const Heading = ({ level, children, className = '', ...props }) => {
  const Tag = `h${level > 0 && level < 7 ? level : 1}`;
  const defaultClass = {
    1: 'text-3xl font-bold text-surface-900',
    2: 'text-2xl font-bold text-surface-900',
    3: 'text-xl font-bold text-surface-900',
    4: 'text-lg font-semibold text-surface-900',
    5: 'text-md font-semibold text-surface-900',
    6: 'text-sm font-semibold text-surface-900',
  }[level];

  return (
    <Tag className={`${defaultClass} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;