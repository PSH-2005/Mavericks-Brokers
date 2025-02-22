import React from 'react';

export const Button = ({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", value, onChange, required, min, step, className = '' }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Tab = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium ${
      isActive 
        ? "border-b-2 border-blue-600 text-blue-600" 
        : "text-gray-600 hover:text-blue-600"
    }`}
  >
    {children}
  </button>
);

export const Alert = ({ message, type = 'error' }) => {
  const types = {
    error: 'bg-red-100 text-red-800 border-red-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${types[type]}`}>
      {message}
    </div>
  );
};