import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue dark:focus:ring-offset-navy-dark';

  const variants = {
    primary: 'bg-primary-blue hover:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground hover:text-white dark:hover:text-white shadow-sm hover:shadow-lg border border-primary-blue hover:border-neutral-800 dark:hover:border-neutral-700',
    secondary: 'bg-surface border-2 border-neutral-200 dark:border-neutral-700 text-foreground hover:bg-neutral-800 dark:hover:bg-neutral-700 hover:text-white dark:hover:text-white hover:border-neutral-800 dark:hover:border-neutral-700 shadow-sm',
    accent: 'bg-violet-accent hover:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground hover:text-white dark:hover:text-white shadow-sm hover:shadow-lg border border-violet-accent hover:border-neutral-800 dark:hover:border-neutral-700',
    outline: 'border-2 border-neutral-300 dark:border-neutral-600 text-foreground hover:bg-neutral-800 dark:hover:bg-neutral-700 hover:text-white dark:hover:text-white hover:border-neutral-800 dark:hover:border-neutral-700 transition-colors',
    ghost: 'bg-transparent hover:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground/70 hover:text-white dark:hover:text-white border border-transparent hover:border-neutral-800 dark:hover:border-neutral-700',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

