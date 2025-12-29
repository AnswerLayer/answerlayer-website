import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="uppercase text-sm tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`border-2 border-black px-4 py-3 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600 uppercase tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="uppercase text-sm tracking-wide">
          {label}
        </label>
      )}
      <textarea
        className={`border-2 border-black px-4 py-3 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px] ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600 uppercase tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
