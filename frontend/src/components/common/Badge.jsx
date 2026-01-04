import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-purple-500 bg-opacity-20 border border-purple-400 border-opacity-30 text-purple-300',
    success: 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30 text-green-300',
    warning: 'bg-yellow-500 bg-opacity-20 border border-yellow-400 border-opacity-30 text-yellow-300',
    danger: 'bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 text-red-300',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;