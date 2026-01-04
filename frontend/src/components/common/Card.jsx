import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'glass',
  hover = true,
  padding = 'md',
  className = '',
  onClick
}) => {
  
  const variants = {
    glass: "bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20",
    solid: "bg-gray-800",
    gradient: "bg-gradient-to-br from-purple-900 to-pink-900",
    outline: "border-2 border-purple-500 bg-transparent",
  };
  
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };
  
  const cardClasses = `rounded-xl transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${
    hover ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : ''
  } ${className}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;