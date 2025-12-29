import React from 'react';
import { Button } from './Button';
import { Badge } from './Badge';

interface HeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  primaryCta?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; onClick: () => void };
}

export function Hero({
  badge,
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta
}: HeroProps) {
  return (
    <section className="bg-navy-900 text-white py-20 md:py-32 border-b-2 border-navy-800">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl">
          {badge && (
            <div className="mb-6">
              <Badge variant="filled" className="border-navy-400 bg-navy-800 text-navy-50">
                {badge}
              </Badge>
            </div>
          )}
          
          <h1 className="mb-4 text-white">
            {title}
          </h1>
          
          {subtitle && (
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px bg-navy-400 flex-1 max-w-[100px]"></div>
              <p className="uppercase tracking-widest text-sm text-navy-300">
                {subtitle}
              </p>
            </div>
          )}
          
          <p className="text-lg md:text-xl mb-10 text-navy-100">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            {primaryCta && (
              <Button 
                variant="primary" 
                size="lg"
                onClick={primaryCta.onClick}
                className="bg-white text-navy-900 border-white hover:bg-navy-50"
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={secondaryCta.onClick}
                className="border-white text-white hover:bg-white hover:text-navy-900"
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}