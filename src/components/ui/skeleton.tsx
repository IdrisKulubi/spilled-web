"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circle' | 'rounded' | 'text';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200";
  
  const variantStyles = {
    default: "rounded-md",
    circle: "rounded-full",
    rounded: "rounded-lg", 
    text: "rounded-sm"
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

// Specialized skeleton components
function SkeletonText({ 
  lines = 1, 
  className,
  lastLineWidth = "75%"
}: { 
  lines?: number; 
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className="h-4"
          style={{ width: i === lines - 1 ? lastLineWidth : "100%" }}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({ 
  size = "md",
  className 
}: { 
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <Skeleton
      variant="circle"
      className={cn(sizeStyles[size], className)}
    />
  );
}

function SkeletonButton({ 
  width = "w-20",
  className 
}: { 
  width?: string;
  className?: string;
}) {
  return (
    <Skeleton
      variant="rounded"
      className={cn("h-8", width, className)}
    />
  );
}

function SkeletonBadge({ 
  width = "w-24",
  className 
}: { 
  width?: string;
  className?: string;
}) {
  return (
    <Skeleton
      variant="rounded"
      className={cn("h-6", width, className)}
    />
  );
}

function SkeletonImage({ 
  height = "h-64",
  className 
}: { 
  height?: string;
  className?: string;
}) {
  return (
    <Skeleton
      variant="rounded"
      className={cn("w-full", height, className)}
    />
  );
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton, SkeletonBadge, SkeletonImage };
