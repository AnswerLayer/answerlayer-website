import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  background?: 'light' | 'white' | 'navy';
  pattern?: boolean;
  border?: boolean;
  className?: string;
}

export function Section({ 
  children, 
  background = 'light',
  pattern = false,
  border = false,
  className = '' 
}: SectionProps) {
  const backgrounds = {
    light: 'bg-background text-foreground',
    white: 'bg-white text-foreground',
    navy: 'bg-navy-900 text-white'
  };

  return (
    <section 
      className={`
        ${backgrounds[background]} 
        ${pattern ? 'grid-pattern' : ''} 
        ${border ? 'border-b-2 border-gray-200' : ''} 
        py-16 md:py-24
        ${className}
      `}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description,
  align = 'left',
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center mx-auto max-w-4xl' : 'max-w-5xl'} ${className}`}>
      {subtitle && (
        <div className="mb-4">
          <span className="text-sm tracking-widest uppercase text-gray-600">
            {subtitle}
          </span>
        </div>
      )}
      <h2 className="mb-4">{title}</h2>
      {description && (
        <p className="text-lg text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}