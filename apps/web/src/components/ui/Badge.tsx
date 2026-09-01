import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'active'
    | 'limited'
    | 'paused'
    | 'closed'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'
    | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
  const variants = {
    active: 'bg-green-100 text-green-800 border border-green-300',
    limited: 'bg-amber-100 text-amber-800 border border-amber-300',
    paused: 'bg-orange-100 text-orange-800 border border-orange-300',
    closed: 'bg-red-100 text-red-800 border border-red-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    neutral: 'bg-stone-100 text-stone-800 border border-stone-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
};
