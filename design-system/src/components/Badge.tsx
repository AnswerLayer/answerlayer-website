import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center uppercase tracking-wider border';
  
  const variants = {
    default: 'bg-white text-navy-900 border-navy-900',
    outlined: 'bg-transparent text-navy-900 border-2 border-navy-900',
    filled: 'bg-navy-900 text-white border-navy-900'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}