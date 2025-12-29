import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center uppercase tracking-wide transition-all duration-150 border-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-navy-600 text-white border-navy-600 hover:bg-navy-700 hover:border-navy-700',
    secondary: 'bg-white text-navy-900 border-navy-900 hover:bg-gray-50',
    outline: 'bg-transparent text-navy-900 border-navy-900 hover:bg-navy-900 hover:text-white',
    ghost: 'bg-transparent text-navy-900 border-transparent hover:border-navy-900'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}