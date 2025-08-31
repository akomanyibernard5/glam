import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'gray';
}

export default function LoadingSpinner({ size = 'md', variant = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variantClasses = {
    primary: 'text-rose-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="32"
          className="animate-pulse"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="0"
          className="opacity-25"
        />
      </svg>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white animate-fade-in-up">
      <div className="aspect-[3/4] bg-gray-200 animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-shimmer" />
        <div className="h-3 bg-gray-200 rounded w-16 animate-shimmer" />
        <div className="h-5 bg-gray-200 rounded w-20 animate-shimmer" />
        <div className="h-8 bg-gray-200 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-up">
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner size="lg" />
          <div className="absolute inset-0 animate-pulse-glow rounded-full" />
        </div>
        <p className="mt-4 text-sm text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}