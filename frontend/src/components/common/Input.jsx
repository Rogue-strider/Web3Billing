import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;