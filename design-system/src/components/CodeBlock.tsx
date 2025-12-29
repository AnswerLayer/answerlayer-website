import React from 'react';
import { Badge } from './Badge';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ 
  code, 
  language = 'javascript', 
  title,
  showLineNumbers = true 
}: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className="border-2 border-black bg-white overflow-hidden">
      {title && (
        <div className="border-b-2 border-black px-4 py-3 flex items-center justify-between bg-gray-50">
          <span className="uppercase text-sm tracking-wide">{title}</span>
          <Badge variant="outlined" size="sm">{language}</Badge>
        </div>
      )}
      <div className="bg-navy-900 text-white p-6 overflow-x-auto">
        <pre className="border-0 p-0 m-0 bg-transparent">
          {showLineNumbers ? (
            <code className="bg-transparent border-0 p-0">
              {lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 select-none w-12 inline-block text-right pr-4">
                    {index + 1}
                  </span>
                  <span>{line || ' '}</span>
                </div>
              ))}
            </code>
          ) : (
            <code className="bg-transparent border-0 p-0">{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
