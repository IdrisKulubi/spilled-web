"use client";

import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar 
} from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CommentSkeleton() {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar Skeleton */}
      <SkeletonAvatar size="sm" className="mt-1" />
      
      <div className="flex-1 min-w-0">
        {/* Author name and timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-3 w-16" />
        </div>
        
        {/* Comment content - random length to mimic real comments */}
        <SkeletonText 
          lines={Math.floor(Math.random() * 3) + 1} 
          lastLineWidth={`${Math.floor(Math.random() * 40) + 40}%`}
        />
      </div>
    </div>
  );
}

export function CommentSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <CommentSkeleton />
          {i < count - 1 && <Separator className="mt-4" />}
        </div>
      ))}
    </div>
  );
}

// Loading state for when no comments exist yet
export function CommentLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <CommentSkeletonList count={2} />
    </div>
  );
}
