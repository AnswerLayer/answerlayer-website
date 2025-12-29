import React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { CircularBadge } from './CircularBadge';

interface CRTHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; onClick: () => void };
  showCircularBadge?: boolean;
  circularText?: string;
}

export function CRTHero({
  badge,
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  showCircularBadge = true,
  circularText = 'NUCLEUS ENGINEERING OFFICE'
}: CRTHeroProps) {
  return (
    <div className="relative border-b-2 border-navy-900 bg-navy-900 text-white overflow-hidden crt-screen">
      {/* Background grid pattern with CRT effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-pattern h-full"></div>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {badge && (
              <div>
                <Badge variant="outlined" size="md" className="crt-badge border-navy-100 text-navy-100">
                  {badge}
                </Badge>
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-white crt-text" style={{ fontSize: '4.5rem', lineHeight: '1' }}>
                {title}
              </h1>
              {subtitle && (
                <div className="crt-text text-2xl tracking-wider text-navy-100">
                  {subtitle}
                </div>
              )}
            </div>

            {description && (
              <p className="text-lg leading-relaxed text-white opacity-90 max-w-xl">
                {description}
              </p>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap gap-4 pt-4">
                {primaryCta && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={primaryCta.onClick}
                    className="bg-navy-600 text-white border-2 border-navy-600 hover:bg-navy-700 hover:border-navy-700"
                  >
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={secondaryCta.onClick}
                    className="text-white hover:bg-navy-800"
                  >
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )}

            {/* Technical metadata */}
            <div className="pt-8 border-t border-navy-700">
              <div className="grid grid-cols-2 gap-6 text-sm font-mono">
                <div>
                  <div className="text-navy-400 uppercase text-xs mb-1">Status</div>
                  <div className="crt-text text-navy-100">OPERATIONAL</div>
                </div>
                <div>
                  <div className="text-navy-400 uppercase text-xs mb-1">Location</div>
                  <div className="crt-text text-navy-100">GLOBAL GRID</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Technical Graphics */}
          <div className="relative">
            {showCircularBadge && (
              <div className="relative">
                <CircularBadge 
                  text={circularText}
                  size={320}
                  className="mx-auto crt-glow"
                />
                
                {/* Technical diagram overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-48 h-48">
                    {/* Orbital rings */}
                    <div className="absolute inset-0 border-2 border-navy-300 rounded-full crt-glow opacity-60"></div>
                    <div className="absolute inset-4 border-2 border-navy-400 rounded-full crt-glow opacity-50" style={{ transform: 'rotate(45deg)' }}></div>
                    <div className="absolute inset-8 border-2 border-navy-500 rounded-full crt-glow opacity-40" style={{ transform: 'rotate(90deg)' }}></div>
                    
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full crt-glow"></div>
                    
                    {/* Connection nodes */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-navy-300 rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-navy-300 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-navy-300 rounded-full"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-navy-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration mark in corner */}
            <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white rounded-full flex items-center justify-center crt-badge">
              <span className="text-2xl">®</span>
            </div>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="mt-16 pt-8 border-t border-navy-700 font-mono text-xs text-navy-400 uppercase tracking-wider">
          <div className="flex flex-wrap gap-8 items-center">
            <div className="crt-text">UNITED STATES OF AMERICA</div>
            <div className="crt-text">ROBOTIC DEVELOPMENT GROUP</div>
            <div className="crt-text">BADGE ID: RDG-06-CTRL</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-navy-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-navy-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}