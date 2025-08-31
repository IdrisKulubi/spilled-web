"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Import the component with no SSR to avoid hydration issues
const HomeHubTabs = dynamic(() => import("./HomeHubTabs"), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-4">
        <div className="flex-1 h-10 bg-background rounded-md animate-pulse" />
        <div className="flex-1 h-10 bg-background rounded-md animate-pulse" />
        <div className="flex-1 h-10 bg-background rounded-md animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-20 bg-muted rounded-lg animate-pulse" />
        <div className="h-20 bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  ),
});

type TabKey = "search" | "share" | "explore";

interface HomeHubTabsWrapperProps {
  displayName: string;
  initialTab?: TabKey;
}

export default function HomeHubTabsWrapper({ displayName, initialTab }: HomeHubTabsWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full">
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-4">
          <div className="flex-1 h-10 bg-background rounded-md animate-pulse" />
          <div className="flex-1 h-10 bg-background rounded-md animate-pulse" />
          <div className="flex-1 h-10 bg-background rounded-md animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded-lg animate-pulse" />
          <div className="h-20 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    }>
      <HomeHubTabs displayName={displayName} initialTab={initialTab} />
    </Suspense>
  );
}
