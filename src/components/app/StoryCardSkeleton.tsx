"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonBadge, 
  SkeletonImage 
} from "@/components/ui/skeleton";

export function StoryCardSkeleton() {
  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar Skeleton */}
          <SkeletonAvatar size="xl" className="border-2 border-white shadow-md" />
          
          <div className="flex-1 min-w-0">
            {/* Badge and timestamp */}
            <div className="flex items-center gap-2 mb-2">
              <SkeletonBadge width="w-28" />
              <Skeleton variant="text" className="h-3 w-16" />
            </div>
            
            {/* Guy name and details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton variant="text" className="h-5 w-32" />
                <Skeleton variant="text" className="h-4 w-8" />
              </div>
              <Skeleton variant="text" className="h-4 w-24" />
            </div>
          </div>
          
          {/* More button skeleton */}
          <Skeleton variant="circle" className="h-8 w-8" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Content skeleton */}
        <SkeletonText lines={3} lastLineWidth="60%" />
        
        {/* Image skeleton - randomly show/hide to mimic real behavior */}
        {Math.random() > 0.3 && (
          <SkeletonImage height="h-80" className="rounded-xl" />
        )}
        
        {/* Reactions section skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Reaction buttons */}
            <SkeletonButton width="w-12" />
            <SkeletonButton width="w-14" />
            <SkeletonButton width="w-16" />
            <Skeleton variant="text" className="h-3 w-20 ml-2" />
          </div>
          
          {/* Comment button */}
          <SkeletonButton width="w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

// Multiple skeleton cards for loading states
export function StoryCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
