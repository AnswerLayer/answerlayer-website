import React from 'react';

interface Stat {
  value: string;
  label: string;
  unit?: string;
}

interface StatsProps {
  stats: Stat[];
  variant?: 'horizontal' | 'grid';
}

export function Stats({ stats, variant = 'horizontal' }: StatsProps) {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="border-2 border-black p-6 bg-white text-center"
          >
            <div className="text-4xl md:text-5xl mb-2">
              {stat.value}
              {stat.unit && <span className="text-2xl ml-1">{stat.unit}</span>}
            </div>
            <div className="text-sm uppercase tracking-wide text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-12 md:gap-20">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-5xl md:text-6xl mb-2">
            {stat.value}
            {stat.unit && <span className="text-3xl ml-1">{stat.unit}</span>}
          </div>
          <div className="uppercase tracking-wide text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
