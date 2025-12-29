import React from 'react';
import { Button } from './Button';

interface CTAProps {
  title: string;
  description: string;
  primaryButton?: { label: string; onClick: () => void };
  secondaryButton?: { label: string; onClick: () => void };
  variant?: 'default' | 'bordered';
}

export function CTA({ 
  title, 
  description, 
  primaryButton,
  secondaryButton,
  variant = 'default'
}: CTAProps) {
  const containerClass = variant === 'bordered' 
    ? 'border-4 border-black p-8 md:p-12 bg-white' 
    : 'p-8 md:p-12 bg-black text-cream';

  return (
    <div className={containerClass}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="mb-4">{title}</h2>
        <p className={`text-lg mb-8 ${variant === 'default' ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {primaryButton && (
            <Button 
              variant={variant === 'default' ? 'primary' : 'primary'}
              size="lg"
              onClick={primaryButton.onClick}
              className={variant === 'default' ? 'bg-cream text-black border-cream hover:bg-white' : ''}
            >
              {primaryButton.label}
            </Button>
          )}
          {secondaryButton && (
            <Button 
              variant="outline"
              size="lg"
              onClick={secondaryButton.onClick}
              className={variant === 'default' ? 'border-cream text-cream hover:bg-cream hover:text-black' : ''}
            >
              {secondaryButton.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
