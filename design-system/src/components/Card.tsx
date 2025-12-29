import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'technical';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '' 
}: CardProps) {
  const baseStyles = 'bg-white';
  
  const variants = {
    default: 'border border-gray-300',
    bordered: 'border-2 border-navy-900',
    technical: 'border-2 border-navy-900 relative before:content-[""] before:absolute before:top-[-4px] before:left-[-4px] before:right-[-4px] before:bottom-[-4px] before:border before:border-navy-300 before:pointer-events-none'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}