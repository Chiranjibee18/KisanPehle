import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'voice';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none touch-manipulation';

  const variants = {
    primary: 'bg-kisan-600 hover:bg-kisan-700 active:bg-kisan-800 text-white focus:ring-kisan-500 shadow-sm',
    secondary: 'bg-earth-100 hover:bg-earth-200 active:bg-earth-300 text-earth-900 focus:ring-earth-400',
    outline: 'border-2 border-kisan-600 text-kisan-700 hover:bg-kisan-50 active:bg-kisan-100 focus:ring-kisan-500',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500 shadow-sm',
    ghost: 'text-stone-700 hover:bg-stone-100 active:bg-stone-200 focus:ring-stone-400',
    voice: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-900 font-semibold focus:ring-amber-400 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]', // Large touch target
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
    xl: 'text-lg px-8 py-4 gap-3 min-h-[56px]',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
