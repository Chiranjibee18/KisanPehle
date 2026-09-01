import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'accent' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyles = 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl transition-all';
  const variants = {
    default: 'border border-stone-200 dark:border-stone-800 shadow-sm',
    elevated: 'border border-stone-200 dark:border-stone-700 shadow-md',
    bordered: 'border-2 border-stone-300 dark:border-stone-700',
    accent: 'border-2 border-kisan-500 bg-kisan-50/60 dark:bg-kisan-950/60 text-stone-900 dark:text-stone-100 shadow-sm',
    highlight: 'border-2 border-amber-500 bg-amber-50/60 dark:bg-amber-950/60 text-stone-900 dark:text-stone-100 shadow-sm',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};
