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
        bg-white rounded-xl border border-neutral-100 shadow-sm
        ${hover ? 'hover:shadow-lg hover:border-blue-200 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
