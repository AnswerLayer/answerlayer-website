import React from 'react';
import { Card } from './Card';

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {features.map((feature, index) => (
        <Card key={index} variant="bordered" padding="lg">
          {feature.badge && (
            <div className="mb-4">
              <span className="border border-black px-2 py-1 text-xs uppercase tracking-wider">
                {feature.badge}
              </span>
            </div>
          )}
          {feature.icon && (
            <div className="mb-4 text-4xl">
              {feature.icon}
            </div>
          )}
          <h4 className="mb-3">{feature.title}</h4>
          <p className="text-gray-600">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
