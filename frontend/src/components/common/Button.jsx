import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props 
}) => {
  
  const baseStyles = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white bg-opacity-10 hover:bg-opacity-20 text-white backdrop-blur-sm border border-white border-opacity-20",
    outline: "border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white",
    ghost: "text-gray-300 hover:bg-white hover:bg-opacity-10",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;