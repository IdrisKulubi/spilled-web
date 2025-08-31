"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchSection } from "./sections/SearchSection";
import { ShareStorySection } from "./sections/ShareStorySection";
import { ExploreSection } from "./sections/ExploreSection";

type TabKey = "search" | "share" | "explore";

export default function HomeHubTabs({ displayName, initialTab }: { displayName: string; initialTab?: TabKey }) {
  const [tab, setTab] = React.useState<TabKey>(initialTab ?? "explore");
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Establish initial tab from URL hash or localStorage if present
    let next: TabKey = initialTab ?? "explore";
    if (typeof window !== "undefined") {
      const hash = window.location.hash?.replace("#", "");
      if (hash === "search" || hash === "share" || hash === "explore") {
        next = hash;
      } else {
        const last = window.localStorage.getItem("spilled:lastTab");
        if (last === "search" || last === "share" || last === "explore") {
          next = last;
        }
      }
    }
    setTab(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      window.localStorage.setItem("spilled:lastTab", tab);
    }
  }, [tab, isClient]);

  // Update tab when URL hash changes (#search, #share, #explore)
  React.useEffect(() => {
    if (!isClient) return;
    
    function onHash() {
      if (typeof window === "undefined") return;
      const h = window.location.hash?.replace("#", "");
      if (h === "search" || h === "share" || h === "explore") setTab(h);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [isClient]);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
      <TabsList className="w-full flex items-center gap-2 md:flex-wrap">
        <TabsTrigger className="rounded-full" value="search">Search</TabsTrigger>
        <TabsTrigger className="rounded-full" value="share">Share</TabsTrigger>
        <TabsTrigger className="rounded-full" value="explore">Explore</TabsTrigger>
      </TabsList>
      <div className="mt-4 space-y-6">
        <TabsContent id="search" value="search" className="m-0">
          <SearchSection />
        </TabsContent>
        <TabsContent id="share" value="share" className="m-0">
          <ShareStorySection />
        </TabsContent>
        <TabsContent id="explore" value="explore" className="m-0">
          <ExploreSection />
        </TabsContent>
      </div>
    </Tabs>
  );
}

