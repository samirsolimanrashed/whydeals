import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <div
      className={`
        bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm
        ${hover ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
