'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse rounded-xl bg-white/5 border border-white/10', className)
      )}
      {...props}
    />
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };
  return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return <Skeleton className={`${width} ${height}`} />;
}
