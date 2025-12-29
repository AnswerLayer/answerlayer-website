import React from 'react';

interface DiagramNode {
  id: string;
  label: string;
  type?: 'box' | 'circle' | 'database';
}

interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
}

interface TechnicalDiagramProps {
  title: string;
  nodes: DiagramNode[];
  connections?: DiagramConnection[];
  className?: string;
}

export function TechnicalDiagram({ 
  title, 
  nodes, 
  connections = [],
  className = '' 
}: TechnicalDiagramProps) {
  return (
    <div className={`bg-white border-2 border-black p-6 ${className}`}>
      <div className="border-b-2 border-black pb-4 mb-6">
        <h3 className="text-lg">{title}</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="flex flex-col items-center gap-2">
            {node.type === 'circle' ? (
              <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center">
                <span className="text-xs text-center px-2">{node.label}</span>
              </div>
            ) : node.type === 'database' ? (
              <div className="relative">
                <div className="w-20 h-24 border-2 border-black rounded-b-full flex items-center justify-center">
                  <span className="text-xs text-center px-2">{node.label}</span>
                </div>
                <div className="absolute top-0 left-0 right-0 h-4 border-2 border-black bg-white rounded-t-full"></div>
              </div>
            ) : (
              <div className="w-full h-20 border-2 border-black flex items-center justify-center p-2">
                <span className="text-xs text-center uppercase">{node.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {connections.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="text-xs uppercase tracking-wide mb-2">Connections:</div>
          <div className="space-y-1">
            {connections.map((conn, idx) => (
              <div key={idx} className="text-xs flex items-center gap-2">
                <span>{conn.from}</span>
                <span>→</span>
                <span>{conn.to}</span>
                {conn.label && <span className="text-gray-500">({conn.label})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
