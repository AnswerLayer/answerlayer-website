import React from 'react';

interface CircularBadgeProps {
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CircularBadge({ 
  title, 
  subtitle,
  size = 'md',
  className = '' 
}: CircularBadgeProps) {
  const sizes = {
    sm: 'w-32 h-32 text-xs',
    md: 'w-48 h-48 text-sm',
    lg: 'w-64 h-64 text-base'
  };

  return (
    <div className={`${sizes[size]} relative ${className}`}>
      {/* Outer Circle */}
      <div className="absolute inset-0 border-2 border-dashed border-cream rounded-full"></div>
      
      {/* Orbital Rings */}
      <div className="absolute inset-4 border border-cream rounded-full opacity-40"></div>
      <div className="absolute inset-8 border border-cream rounded-full opacity-60"></div>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cream rounded-full mb-2 flex items-center justify-center">
          <div className="w-3 h-3 bg-cream rounded-full"></div>
        </div>
      </div>
      
      {/* Circular Text */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
          />
        </defs>
        <text className="text-[10px] fill-cream uppercase tracking-[0.3em]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          <textPath href="#circlePath" startOffset="0%">
            {title} • {subtitle || 'ENGINEERING OFFICE'} • 
          </textPath>
        </text>
      </svg>
    </div>
  );
}
