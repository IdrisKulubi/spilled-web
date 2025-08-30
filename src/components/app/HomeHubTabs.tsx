"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchSection } from "./sections/SearchSection";
import { ShareStorySection } from "./sections/ShareStorySection";
import { ExploreSection } from "./sections/ExploreSection";

export default function HomeHubTabs({ displayName }: { displayName: string }) {
  const [tab, setTab] = React.useState<string>("search");

  React.useEffect(() => {
    // Optionally restore last selected tab from localStorage (parity with AsyncStorage)
    const last = typeof window !== "undefined" ? window.localStorage.getItem("spilled:lastTab") : null;
    if (last) setTab(last);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("spilled:lastTab", tab);
  }, [tab]);

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="share">Share</TabsTrigger>
        <TabsTrigger value="explore">Explore</TabsTrigger>
      </TabsList>
      <div className="mt-4 space-y-6">
        <TabsContent value="search" className="m-0">
          <SearchSection />
        </TabsContent>
        <TabsContent value="share" className="m-0">
          <ShareStorySection />
        </TabsContent>
        <TabsContent value="explore" className="m-0">
          <ExploreSection />
        </TabsContent>
      </div>
    </Tabs>
  );
}

