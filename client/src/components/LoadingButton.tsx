import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingButton({
  children,
  isLoading = false,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const spinnerVariant = variant === 'outline' ? 'gray' : 'white';
  const spinnerSize = size === 'lg' ? 'md' : 'sm';

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading && <LoadingSpinner size={spinnerSize} variant={spinnerVariant} />}
      {children}
    </button>
  );
}