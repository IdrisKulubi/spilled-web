"use client";

import { RecentActivityFeed } from "./RecentActivityFeed";

type RecentActivityFeedWrapperProps = {
  maxItems?: number;
};

export function RecentActivityFeedWrapper({ maxItems = 4 }: RecentActivityFeedWrapperProps) {
  const handleStoryClick = (storyId: string) => {
    // Scroll to explore section when a story is clicked
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <RecentActivityFeed 
      onStoryClick={handleStoryClick}
      maxItems={maxItems}
    />
  );
}
